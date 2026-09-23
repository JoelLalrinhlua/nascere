import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { blankEntry, validateEntry, slugify, publicEntries } from '../src/cms/model.js';

test('publishing requires content and photo descriptions; draft rules and price precision', () => {
  const toy = { ...blankEntry('toy'), title: 'Building blocks', slug: 'building-blocks' };
  assert.equal(validateEntry(toy), '');
  assert.match(validateEntry({ ...toy, status: 'published' }), /description/);
  const ready = { ...toy, summary: 'Stack and build.', status: 'published' };
  assert.equal(validateEntry(ready), '');
  for (const price of ['-1', 'Infinity', '12.345', '1e3']) {
    assert.match(validateEntry({ ...ready, details: { price } }), /price/);
  }
  assert.equal(validateEntry({ ...ready, details: { price: '1299.50' } }), '');
  const memory = { ...ready, kind: 'memory' };
  assert.match(validateEntry(memory), /Upload a photo/);
  assert.match(validateEntry({ ...memory, image_path: 'some-photo' }), /Describe/);
  assert.equal(validateEntry({ ...memory, image_path: 'some-photo', image_alt: 'A painting' }), '');
  assert.equal(slugify(' Café & craft! '), 'cafe-craft');
  assert.match(slugify('a'.repeat(99) + ' word'), /^[a-z0-9]+(-[a-z0-9]+)*$/);
  assert.deepEqual(publicEntries([
    { id: 1, status: 'draft' }, { id: 2, status: 'archived' },
    { id: 3, status: 'published', sort_order: 3, created_at: '2026-01-01' },
    { id: 4, status: 'published', sort_order: 0, created_at: '2026-01-01' },
  ]).map(x => x.id), [4, 3]);
});

test('database and photo policies deny visitors and non-editors; publishing and optimistic updates', async () => {
  const db = new PGlite();
  const editor = '11111111-1111-4111-8111-111111111111';
  const stranger = '22222222-2222-4222-8222-222222222222';
  const photo = `${editor}/33333333-3333-4333-8333-333333333333.webp`;
  try {
    // Supabase owns these schemas in production. Recreate only their SQL contracts.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      grant usage on schema public, auth, storage to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant select, insert, update, delete on storage.objects to anon, authenticated;
      create function storage.foldername(name text) returns text[] language sql immutable as $$
        select string_to_array(name, '/')
      $$;
      insert into auth.users values ('${editor}'), ('${stranger}');
    `);
    await db.exec(await readFile(new URL('../supabase/migrations/202609230001_studio_cms.sql', import.meta.url), 'utf8'));
    await db.query('insert into studio_editors(user_id) values ($1)', [editor]);
    assert.equal((await db.query("select public from storage.buckets where id='studio-media'")).rows[0].public, false);
    const as = async (role, id = '') => {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
      await db.exec(`set role ${role}`);
    };
    await as('authenticated', editor);
    assert.equal((await db.query('select is_studio_editor() as allowed')).rows[0].allowed, true);
    const added = await db.query(`insert into studio_entries(kind,title,slug,category,summary,image_path,image_alt)
      values ('memory','Studio afternoon','studio-afternoon','Art','Making things together.',$1,'A colorful drawing') returning *`, [photo]);
    const item = added.rows[0];
    await db.query("insert into storage.objects(bucket_id,name) values ('studio-media',$1)", [photo]);
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values ('studio-media',$1)", [`${stranger}/wrong.webp`]), /row-level security/);

    await as('anon');
    assert.equal((await db.query('select * from studio_entries')).rows.length, 0, 'draft content is private');
    assert.equal((await db.query('select * from storage.objects')).rows.length, 0, 'draft photo is private');
    await assert.rejects(db.query("insert into studio_entries(kind,title,slug) values ('post','No','no')"), /permission denied/);
    await assert.rejects(db.query('select * from studio_editors'), /permission denied/);

    await as('authenticated', stranger);
    assert.equal((await db.query('select is_studio_editor() as allowed')).rows[0].allowed, false);
    assert.equal((await db.query('select * from studio_entries')).rows.length, 0);
    await assert.rejects(db.query('insert into studio_editors(user_id) values ($1)', [stranger]), /permission denied/);
    await assert.rejects(db.query("insert into studio_entries(kind,title,slug) values ('post','No','no')"), /row-level security/);
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values ('studio-media',$1)", [`${stranger}/no.webp`]), /row-level security/);

    await as('authenticated', editor);
    const published = await db.query("update studio_entries set status='published' where id=$1 returning updated_at", [item.id]);
    const version = published.rows[0].updated_at;
    await as('anon');
    assert.equal((await db.query('select title from studio_entries')).rows[0].title, 'Studio afternoon');
    assert.equal((await db.query('select * from storage.objects')).rows.length, 1);
    await as('authenticated', stranger);
    assert.equal((await db.query("update studio_entries set title='Hijacked' where id=$1 returning id", [item.id])).rows.length, 0);
    assert.equal((await db.query('delete from storage.objects returning id')).rows.length, 0);

    await as('authenticated', editor);
    assert.equal((await db.query("update studio_entries set title='Updated afternoon' where id=$1 and updated_at=$2 returning id", [item.id, version])).rows.length, 1);
    assert.equal((await db.query("update studio_entries set title='Stale overwrite' where id=$1 and updated_at=$2 returning id", [item.id, version])).rows.length, 0, 'old versions cannot overwrite new changes');
    await assert.rejects(db.query("insert into studio_entries(kind,title,slug,summary,status) values ('memory','No photo','no-photo','','published')"), /check constraint/);
    await assert.rejects(db.query("insert into studio_entries(kind,title,slug,summary,status) values ('toy','No description','no-description','','published')"), /check constraint/);
    await assert.rejects(db.query("insert into studio_entries(kind,title,slug) values ('memory','Duplicate','studio-afternoon')"), /unique constraint/);
    await assert.rejects(db.query('delete from studio_entries where id=$1', [item.id]), /permission denied/);
    assert.equal((await db.query('delete from storage.objects returning id')).rows.length, 0, 'referenced photo cannot be deleted');
    await db.query("update studio_entries set status='archived' where id=$1", [item.id]);
    await as('anon');
    assert.equal((await db.query('select * from studio_entries')).rows.length, 0);
    assert.equal((await db.query('select * from storage.objects')).rows.length, 0);
    await as('authenticated', editor);
    assert.equal((await db.query('select * from studio_entries')).rows.length, 1, 'editor can restore archives');
    await db.query("update studio_entries set status='published' where id=$1", [item.id]);
    await as('anon');
    assert.equal((await db.query('select * from studio_entries')).rows.length, 1);
  } finally { await db.close(); }
});

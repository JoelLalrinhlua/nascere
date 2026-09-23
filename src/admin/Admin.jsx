import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Plus, MagnifyingGlass, SignOut, House, NotePencil, Shapes, Images, ArrowLeft, UploadSimple, CheckCircle, Archive, Flower, WarningCircle } from '@phosphor-icons/react';
import { Brand, FlowerMark } from '../components';
import { configured, previewMode, supabase } from '../cms/client';
import { listEntries, isEditor, saveEntry, importExisting, uploadImage, hydrateImages, notifyContentChanged } from '../cms/api';
import { blankEntry, KINDS, slugify, validateEntry } from '../cms/model';
import { prepareImage } from '../cms/image';
import './admin.css';

const sections = [ ['overview', 'Overview', House], ['post', 'Posts', NotePencil], ['toy', 'Toys', Shapes], ['memory', 'Memories', Images] ];
const singular = { post: 'post', toy: 'toy', memory: 'memory' };

function Setup() {
  return <div className="admin-gate"><Brand /><FlowerMark size={70} /><h1>Your studio, behind the scenes.</h1><p>The dashboard is ready to connect. Finish the one-time Supabase setup to sign in and manage your website.</p><ol><li>Create your Supabase project.</li><li>Run the supplied setup file and add your editor account.</li><li>Add the two public connection values in Vercel and redeploy.</li></ol><p className="admin-help">Full instructions are in <strong>ADMIN-SETUP.md</strong> in your repository.</p><a className="admin-button secondary" href="/">Back to your website <ArrowUpRight /></a></div>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
    } catch { setError('We couldn’t sign you in. Check your email and password, then try again.'); }
    finally { setBusy(false); }
  }
  return <div className="admin-gate"><Brand /><FlowerMark size={68} /><p className="admin-kicker">NASCERE STUDIO · ADMIN</p><h1>A little space<br />to make things happen.</h1><p>Sign in to look after your posts, toys and studio memories.</p><form onSubmit={submit}><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error && <p role="alert" className="admin-error">{error}</p>}<button className="admin-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowUpRight /></button></form><a href="/" className="admin-back">Back to the website</a></div>;
}

function Field({ label, children, hint }) { return <label className="admin-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }

function Editor({ entry, onClose, onSaved }) {
  const [draft, setDraft] = useState(structuredClone(entry));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const form = useRef(null);
  const slugTouched = useRef(Boolean(entry.id));
  const fileInput = useRef(null);
  const set = (key, value) => { setDirty(true); setDraft(d=>({ ...d, [key]:value })); };
  const detail = (key, value) => { setDirty(true); setDraft(d=>({ ...d, details:{...d.details,[key]:value} })); };
  useEffect(()=> {
    const warn = e => { if(dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload',warn);
    return ()=>window.removeEventListener('beforeunload',warn);
  },[dirty]);
  function close() { if (!dirty || window.confirm('Discard your unsaved changes?')) onClose(); }
  async function upload(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true); setError('');
    try {
      const blob = await prepareImage(file);
      const path = await uploadImage(blob);
      const [hydrated] = await hydrateImages([{ image_path: path }]);
      setDraft(d=>({...d,image_path:path,imageUrl:hydrated.imageUrl})); setDirty(true);
    } catch(error) { setError(error.message); }
    finally { setUploading(false); if(fileInput.current) fileInput.current.value=''; }
  }
  async function save(status) {
    const next = {...draft,status};
    const issue = validateEntry(next);
    if(issue) { setError(issue); return; }
    if (!preview && !form.current.reportValidity()) return;
    setBusy(true); setError('');
    try {
      await saveEntry(next); setDirty(false); notifyContentChanged(); onSaved(status);
    } catch(error) { setError(error.message); }
    finally { setBusy(false); }
  }
  const publicLabel = draft.kind === 'toy' ? 'Our Toys' : draft.kind === 'memory' ? 'Memories' : 'Studio journal';
  return <div className="admin-editor"><div className="admin-editor-top"><button className="admin-back" onClick={close} disabled={busy||uploading}><ArrowLeft /> Back to {KINDS[draft.kind].toLowerCase()}</button><span className="admin-unsaved">{dirty ? 'Unsaved changes' : draft.id ? 'Saved item' : 'New item'}</span></div><div className="admin-heading"><div><p className="admin-kicker">{KINDS[draft.kind]}</p><h1>{draft.id ? 'Edit' : 'Create a'} {singular[draft.kind]}</h1><p>A little care here makes a lovely impression out there.</p></div><button className="admin-button secondary" onClick={()=>setPreview(!preview)}>{preview ? 'Back to editing' : 'Preview content'}</button></div>
    {error && <p className="admin-error" role="alert"><WarningCircle /> {error}</p>}
    <form ref={form} onSubmit={e=>{e.preventDefault();save(draft.status === 'published' ? 'published' : 'draft');}}>
      <div className="admin-editor-grid">
        <div className="admin-panel admin-fields" hidden={preview}>
          <Field label={draft.kind === 'toy' ? 'Toy name' : 'Title'}><input required maxLength={160} value={draft.title} onChange={e=>{set('title',e.target.value);if(!slugTouched.current)set('slug',slugify(e.target.value));}} placeholder={draft.kind === 'toy' ? 'What is this toy called?' : 'Give this moment a name'} /></Field>
          <div className="admin-two-columns"><Field label="Category"><input maxLength={100} required value={draft.category} onChange={e=>set('category',e.target.value)} placeholder="e.g. Art, Music, Studio life" /></Field><Field label="URL name" hint="Use lowercase letters, numbers and hyphens. Keep this unchanged after sharing a post."><input required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={e=>{slugTouched.current=true;set('slug',e.target.value);}} /></Field></div>
          <Field label={draft.kind === 'memory' ? 'Photo caption' : 'Short description'} hint="Shown on the website alongside the image."><textarea rows={4} maxLength={1200} value={draft.summary} onChange={e=>set('summary',e.target.value)} /></Field>
          {draft.kind === 'post' && <><Field label="Your story" hint="Use a blank line to start a new paragraph."><textarea rows={12} maxLength={40000} value={draft.body} onChange={e=>set('body',e.target.value)} placeholder="Tell the story behind this post…" /></Field><Field label="Instagram post ID (optional)" hint="The short code from the Instagram post link."><input maxLength={80} pattern="[A-Za-z0-9_-]*" value={draft.details.instagram||''} onChange={e=>detail('instagram',e.target.value)} /></Field></>}
          {draft.kind === 'toy' && <><div className="admin-two-columns"><Field label="Suggested age"><input maxLength={80} value={draft.details.age||''} onChange={e=>detail('age',e.target.value)} placeholder="e.g. 3+ years" /></Field><Field label="Price in ₹ (optional)" hint="Leave empty for price enquiries on WhatsApp."><input type="number" min="0" max="10000000" step="0.01" value={draft.details.price??''} onChange={e=>detail('price',e.target.value)} /></Field></div><Field label="What it helps grow" hint="One benefit per line."><textarea rows={4} maxLength={1000} value={(draft.details.benefits||[]).join('\n')} onChange={e=>detail('benefits',e.target.value.split('\n'))} /></Field><Field label="Card color"><select value={draft.details.color||'pink'} onChange={e=>detail('color',e.target.value)}><option value="pink">Petal pink</option><option value="yellow">Sunflower yellow</option><option value="teal">Garden teal</option><option value="purple">Soft lavender</option></select></Field></>}
        </div>
        {preview && <article className="admin-panel admin-content-preview"><p className="admin-kicker">CONTENT PREVIEW · {publicLabel}</p>{draft.imageUrl && <img src={draft.imageUrl} alt={draft.image_alt||'Selected photo'} />}<small>{draft.category}</small><h2>{draft.title||'Your title goes here'}</h2><p>{draft.summary||'Your description will appear here.'}</p>{draft.body.split(/\n\s*\n/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}{draft.kind==='toy' && <><p>{draft.details.age}{draft.details.price!==''&&draft.details.price!=null ? ` · ₹${draft.details.price}`:''}</p><ul>{(draft.details.benefits||[]).filter(Boolean).map((benefit,i)=><li key={i}>{benefit}</li>)}</ul></>}</article>}
        <aside className="admin-editor-aside"><div className="admin-panel"><h2>{draft.kind==='memory'?'Memory photo':'Cover photo'}</h2><p className="admin-help">JPG, PNG or WebP · up to 8 MB</p><div className="admin-upload">{draft.imageUrl ? <img src={draft.imageUrl} alt={draft.image_alt||'Selected photo'} /> : <div><Images size={46} weight="thin"/><p>A picture makes it yours.</p></div>}</div><input ref={fileInput} id="content-photo" className="admin-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={uploading||busy}/><label className="admin-button secondary upload-label" htmlFor="content-photo"><UploadSimple /> {uploading?'Preparing your photo…':draft.image_path?'Replace photo':'Upload photo'}</label>{draft.image_path && <button type="button" className="admin-back" disabled={uploading||busy} onClick={()=>{set('image_path','');set('imageUrl','');}}>Remove from this item</button>}<Field label="Describe the photo" hint="A short description for visitors who cannot see the image."><input maxLength={500} value={draft.image_alt} onChange={e=>set('image_alt',e.target.value)} placeholder="What is happening in this picture?" /></Field></div>
        <div className="admin-panel"><h2>Publication</h2><span className={'admin-status '+draft.status}>{draft.status}</span><p className="admin-help">Published items appear on {publicLabel}. Drafts and archived items are private.</p><Field label="Display order" hint="Lower numbers appear first."><input type="number" min="0" max="9999" step="1" required value={draft.sort_order} onChange={e=>set('sort_order',e.target.value)} /></Field><p className="admin-help">{draft.kind==='memory'?'Before publishing, check that you have permission to share the photo.':'You can unpublish this item at any time.'}</p></div></aside>
      </div>
      <div className="admin-save-bar"><span>{uploading?'Uploading photo…':busy?'Saving your changes…':previewMode?'Local preview — changes stay on this computer.':`Your next save updates ${publicLabel}.`}</span><div><button type="button" className="admin-button secondary" disabled={busy||uploading} onClick={()=>save('draft')}>{draft.status==='published'?'Unpublish to draft':'Save draft'}</button><button type="button" className="admin-button" disabled={busy||uploading} onClick={()=>save('published')}><CheckCircle /> {draft.status==='published'?'Save changes':'Publish'}</button></div></div>
    </form>
  </div>;
}

function Dashboard({ user, onSignOut }) {
  const [section,setSection]=useState('overview');
  const [entries,setEntries]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState('all');
  const [editing,setEditing]=useState(null);
  const [busy,setBusy]=useState(false);
  const [archiveTarget,setArchiveTarget]=useState(null);
  async function refresh() {
    setLoading(true); setError('');
    try { setEntries(await listEntries(true)); }
    catch(error){setError(error.message);}
    finally{setLoading(false);}
  }
  useEffect(()=>{refresh();},[]);
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[section,editing?.id,editing?.kind]);
  const navigate = value => {setSection(value);setQuery('');setStatus('all');setNotice('');setEditing(null);setArchiveTarget(null);};
  async function seed() {
    setBusy(true);setError('');
    try { await importExisting();notifyContentChanged();await refresh();setNotice('Existing posts and toys imported. Your edits were kept.'); }
    catch(error){setError(error.message);}
    finally{setBusy(false);}
  }
  async function archive(entry) {
    setBusy(true);setError('');
    try{await saveEntry({...entry,status:'archived'});setArchiveTarget(null);notifyContentChanged();await refresh();setNotice('Item archived. Open it in the Archived filter to restore it.');}
    catch(error){setError(error.message);}finally{setBusy(false);}
  }
  const filtered=entries.filter(e=>(section==='overview'||e.kind===section)&&(status==='all'||e.status===status)&&`${e.title} ${e.category}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>b.updated_at.localeCompare(a.updated_at));
  return <div className="admin-layout"><aside className="admin-sidebar"><Brand /><span className="admin-kicker">THE STUDIO DESK</span><nav aria-label="Dashboard navigation">{sections.map(([value,label,Icon])=><button key={value} aria-current={section===value?'page':undefined} onClick={()=>{if(!editing||window.confirm('Leave this editor? Unsaved changes will be lost.'))navigate(value);}}><Icon size={21}/>{label}{value!=='overview'&&<span>{entries.filter(e=>e.kind===value).length}</span>}</button>)}</nav><div className="admin-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer">View website <ArrowUpRight size={18}/></a><p>{previewMode?'Local studio preview':user?.email}</p>{!previewMode&&<button onClick={onSignOut}><SignOut size={18}/> Sign out</button>}</div></aside><div className="admin-main">{previewMode&&<div className="admin-preview-banner"><WarningCircle size={18}/><span><strong>Local preview.</strong> Changes are saved on this computer only. Connect Supabase to manage the live website.</span></div>}
      {editing ? <Editor key={editing.id||editing.kind} entry={editing} onClose={()=>setEditing(null)} onSaved={async nextStatus=>{setEditing(null);await refresh();setNotice(nextStatus==='published'?'Published — your website is up to date.':'Saved as a private draft.');}}/> : <>
      <div className="admin-heading"><div><p className="admin-kicker">NASCERE STUDIO</p><h1>{section==='overview'?'A little care. A lot of possibility.':KINDS[section]}</h1><p>{section==='overview'?'Welcome to your studio desk. Make something lovely today.':section==='post'?'Stories, news and little discoveries from your studio.':section==='toy'?'Help families find their next favorite plaything.':'A home for the moments you want to remember.'}</p></div>{section==='overview'?<FlowerMark size={68}/>:<button className="admin-button" onClick={()=>setEditing(blankEntry(section))}><Plus size={18}/> Add {singular[section]}</button>}</div>
      {notice&&<p className="admin-notice" role="status"><CheckCircle size={19}/>{previewMode?'Preview: ':''}{notice}</p>}{error&&<div className="admin-error" role="alert"><p>{error}</p><button className="admin-back" onClick={refresh}>Try again</button></div>}
      {archiveTarget&&<div className="admin-archive-prompt" role="alert"><div><h2>Archive “{archiveTarget.title}”?</h2><p>It will be removed from the website. You can restore it from the Archived filter.</p></div><button className="admin-button secondary" disabled={busy} onClick={()=>setArchiveTarget(null)}>Keep item</button><button className="admin-button" disabled={busy} onClick={()=>archive(archiveTarget)}>{busy?'Archiving…':'Confirm archive'}</button></div>}
      {section==='overview'&&<><div className="admin-stats">{sections.slice(1).map(([kind,label,Icon])=><button key={kind} className={'admin-stat '+kind} onClick={()=>navigate(kind)}><Icon size={28} weight="thin"/><span>{entries.filter(e=>e.kind===kind).length}</span><h2>{label}</h2><small>{entries.filter(e=>e.kind===kind&&e.status==='published').length} published <ArrowUpRight /></small></button>)}</div><div className="admin-start"><div><p className="admin-kicker">ROOM FOR SOMETHING NEW</p><h2>What will you share today?</h2><p>Add a story, introduce a toy or collect a memory.</p></div><div>{sections.slice(1).map(([kind,,Icon])=><button key={kind} className="admin-button secondary" onClick={()=>{setSection(kind);setEditing(blankEntry(kind));}}><Icon size={18}/> New {singular[kind]}</button>)}</div></div></>}
      <section className="admin-panel admin-content-list"><div className="admin-list-heading"><h2>{section==='overview'?'Recently updated':`Your ${KINDS[section].toLowerCase()}`}</h2><span>{filtered.length} {filtered.length===1?'item':'items'}</span></div><div className="admin-toolbar"><label className="admin-search"><MagnifyingGlass size={20}/><input aria-label="Search content" placeholder="Find something…" value={query} onChange={e=>setQuery(e.target.value)}/></label><select aria-label="Filter by publication status" value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option><option value="archived">Archived</option></select></div>
      {loading?<p className="admin-empty" role="status">Opening your studio desk…</p>:filtered.length===0?<div className="admin-empty"><Flower size={40} weight="thin"/><h3>{query||status!=='all'?'Nothing matches just yet.':'A fresh page, full of possibilities.'}</h3><p>{query||status!=='all'?'Try a different search or filter.':'Add your first item, or bring over the posts and toys already on your website.'}</p>{!entries.length&&!query&&status==='all'&&<button className="admin-button secondary" onClick={seed} disabled={busy}>{busy?'Importing…':'Import existing content'}</button>}</div>:<div className="admin-rows">{filtered.slice(0,section==='overview'?8:undefined).map(entry=><article className="admin-row" key={entry.id}><button className="admin-row-main" onClick={()=>setEditing(entry)}>{entry.imageUrl?<img src={entry.imageUrl} alt=""/>:<span className={'admin-thumb '+entry.kind}>{entry.kind==='toy'?<Shapes/>:entry.kind==='memory'?<Images/>:<NotePencil/>}</span>}<div><h3>{entry.title}</h3><p>{entry.category} · {KINDS[entry.kind]}</p></div></button><span className={'admin-status '+entry.status}>{entry.status}</span><time dateTime={entry.updated_at}>{new Date(entry.updated_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</time><button className="admin-icon-button" aria-label={`Edit ${entry.title}`} onClick={()=>setEditing(entry)}><NotePencil size={20}/></button>{entry.status!=='archived'&&<button className="admin-icon-button" disabled={busy} aria-label={`Archive ${entry.title}`} onClick={()=>{setArchiveTarget(entry);window.scrollTo({top:0,behavior:'smooth'});}}><Archive size={20}/></button>}</article>)}</div>}
      </section><p className="admin-footnote">A little creativity goes a long way. {entries.length>0&&<button onClick={seed} disabled={busy}>Import missing website content</button>}</p>
      </>}
    </div></div>;
}

export default function Admin() {
  const [user,setUser]=useState(null);
  const [state,setState]=useState(previewMode?'ready':configured?'loading':'setup');
  const [error,setError]=useState('');
  useEffect(()=>{
    document.title='Studio desk | Nascere';
    if(previewMode||!supabase)return;
    let active=true;
    let generation=0;
    async function check(session) {
      const current=++generation;
      if(!session){if(active){setUser(null);setState('login');}return;}
      try{const allowed=await isEditor();if(active&&current===generation){setUser(session.user);setState(allowed?'ready':'denied');}}
      catch(err){if(active&&current===generation){setError(err.message);setState('error');}}
    }
    supabase.auth.getSession().then(({data,error})=>{if(error){if(active){setError(error.message);setState('error');}}else check(data.session);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>{if(active)check(session);},0);});
    return()=>{active=false;subscription.unsubscribe();};
  },[]);
  async function signOut(){const {error}=await supabase.auth.signOut();if(error){setError(error.message);setState('error');}}
  if(state==='setup')return <div className="admin-app"><Setup/></div>;
  if(state==='login')return <div className="admin-app"><Login/></div>;
  if(state==='loading')return <div className="admin-app"><div className="admin-gate"><h1>Opening your studio desk…</h1></div></div>;
  if(state==='error'||state==='denied')return <div className="admin-app"><div className="admin-gate"><Brand/><h1>{state==='denied'?'An editor account is needed.':'We couldn’t open your desk.'}</h1><p role="alert">{state==='denied'?'You’re signed in, but this account has not been given permission to edit Nascere.':error}</p><button className="admin-button" onClick={signOut}>Sign out</button><a href="/admin/" className="admin-back">Try again</a></div></div>;
  return <div className="admin-app"><Dashboard user={user} onSignOut={signOut}/></div>;
}

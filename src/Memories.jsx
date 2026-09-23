import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X, Images } from '@phosphor-icons/react';
import { Eyebrow, FlowerMark } from './components';
import { ContentState, useContent } from './cms/ContentProvider';

function MemoryViewer({ memories, selected, onSelect, onClose }) {
  const dialog = useRef(null);
  const index = memories.findIndex(item=>item.id===selected);
  const memory = memories[index];
  useEffect(()=>{
    if(!memory)return;
    const element=dialog.current;
    element.showModal();
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{element.close();document.body.style.overflow=previous;};
  },[Boolean(memory)]);
  if(!memory)return null;
  const move=direction=>onSelect(memories[(index+direction+memories.length)%memories.length].id);
  return <dialog className="memory-viewer" ref={dialog} onCancel={e=>{e.preventDefault();onClose();}} aria-label={memory.title} onClick={e=>{if(e.target===e.currentTarget)onClose();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
    <div className="memory-viewer-inner"><button autoFocus className="memory-close" onClick={onClose} aria-label="Close photo"><X size={24}/></button><img src={memory.imageUrl} alt={memory.image_alt}/><div className="memory-viewer-caption"><div><h2>{memory.title}</h2>{memory.summary&&<p>{memory.summary}</p>}</div><span>{index+1} / {memories.length}</span></div>{memories.length>1&&<div className="memory-controls"><button onClick={()=>move(-1)} aria-label="Previous photo"><ArrowLeft/> Previous</button><button onClick={()=>move(1)} aria-label="Next photo">Next <ArrowRight/></button></div>}</div>
  </dialog>;
}

export default function Memories() {
  const { memories,loading,error }=useContent();
  const [filter,setFilter]=useState('All');
  const [selected,setSelected]=useState(null);
  const categories=['All',...new Set(memories.map(m=>m.category).filter(Boolean))];
  const visible=memories.filter(m=>filter==='All'||m.category===filter);
  return <section className="memories-page wrap page-section"><div className="memories-heading"><div><Eyebrow>THE LITTLE MOMENTS STAY WITH US</Eyebrow><h1>Made of moments.<br/><em>Kept with love.</em></h1><p>Colorful days, curious minds and the joy of making things together. A little photo album from life at Nascere.</p></div><FlowerMark size={88}/></div>{memories.length>0&&<div className="filters" aria-label="Filter memories">{categories.map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div>}<ContentState empty={!memories.length}>Our album is waiting for its first little memory. Come back soon.</ContentState>{!loading&&!error&&memories.length===0&&<div className="memories-empty" aria-hidden="true"><Images size={74} weight="thin"/></div>}<div className="memories-grid">{visible.map(memory=><button className="memory-card" key={memory.id} onClick={()=>setSelected(memory.id)} aria-label={`Open photo: ${memory.title}`}><div>{memory.imageUrl?<img loading="lazy" src={memory.imageUrl} alt={memory.image_alt}/>:<Images size={64} weight="thin"/>}</div><span>{memory.category}</span><h2>{memory.title}</h2>{memory.summary&&<p>{memory.summary}</p>}</button>)}</div>{selected&&<MemoryViewer memories={visible} selected={selected} onSelect={setSelected} onClose={()=>setSelected(null)}/>}</section>;
}

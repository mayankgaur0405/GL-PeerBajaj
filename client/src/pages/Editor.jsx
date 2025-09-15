import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import Editor from '@monaco-editor/react'
import { useAuth } from '../context/AuthContext.jsx'

export default function EditorPage() {
  const { roomId } = useParams()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const [users, setUsers] = useState([])
  const [typing, setTyping] = useState('')
  const [output, setOutput] = useState('')
  const [version, setVersion] = useState('*')
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [rightPanel, setRightPanel] = useState(null) // 'users' | 'chat' | null
  const [fontSize, setFontSize] = useState(14)
  const [copyMsg, setCopyMsg] = useState('')
  const [files, setFiles] = useState([])
  const [activeFileId, setActiveFileId] = useState(null)
  const [outputPlacement, setOutputPlacement] = useState('bottom') // 'bottom' | 'top' | 'right'
  const [typers, setTypers] = useState(new Map())
  const { user } = useAuth()

  const socketUrl = useMemo(() => {
    if (import.meta.env.PROD) {
      return import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://gl-peerbridge.onrender.com'
    }
    return 'http://localhost:5000'
  }, [])

  const TEMPLATES = useMemo(() => ({
    javascript: `// created by Dev2Gether
// start code here
function main() {
  console.log('Hello, JavaScript!');
}
main();
`,
    python: `# created by Dev2Gether
# start code here
def main():
    print('Hello, Python!')

if __name__ == '__main__':
    main()
`,
    cpp: `// created by Dev2Gether
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << "Hello, C++!" << '\n';
    return 0;
}
`,
    java: `// created by Dev2Gether
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`
  }), [])

  const DEFAULT_VERSIONS = useMemo(() => ({
    javascript: '*',
    python: '*',
    cpp: '*',
    java: '*'
  }), [])

  const connect = (e) => {
    e.preventDefault()
    if (!roomId || !name) return
    const s = io(`${socketUrl}/collab`, {
      query: { roomId, name },
      transports: ['websocket', 'polling']
    })
    socketRef.current = s
    s.on('connect', () => {
      setConnected(true)
      // Join the room so server initializes collabRooms state
      s.emit('join', { roomId, userName: name })
    })
    s.on('disconnect', () => setConnected(false))
    s.on('state', (st) => {
      setCode(st.code || '')
      setLanguage(st.language || 'javascript')
    })
    s.on('code_change', (p) => {
      setCode(p.code)
    })
    s.on('language_change', (p) => setLanguage(p.language))
    // Dev2Gether-compatible events
    s.on('userJoined', (list) => setUsers(list || []))
    s.on('codeUpdate', (newCode) => setCode(String(newCode || '')))
    s.on('userTyping', (who) => {
      const display = String(who || 'User')
      setTyping(`${display.length > 20 ? display.slice(0, 20) + '...' : display} is typing...`)
      // track multiple typers
      // Note: using a simple timeout map would require more state; keep text minimal here
    })
    s.on('languageUpdate', (lang) => setLanguage(String(lang || 'javascript')))
    s.on('codeResponse', (resp) => setOutput(resp?.run?.output || ''))
    s.on('chatMessage', (payload) => {
      const msg = typeof payload === 'string' 
        ? { sender: 'User', text: String(payload), time: Date.now() }
        : { sender: payload.sender || 'User', text: payload.text ?? String(payload), time: payload.time || Date.now() }
      setMessages((prev)=> [...prev, msg])
    })
    s.on('filesState', (st) => { setFiles(st?.files || []); setActiveFileId(st?.activeFileId || null) })
  }

  useEffect(() => {
    return () => {
      try {
        socketRef.current?.emit('leaveRoom')
      } catch {}
      socketRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    // prefill display name from auth
    // if user logs in later, do not overwrite typed name
    // set once on mount or when user first arrives
    // simple guard
    if (user?.name && !name) {
      setName(user.name)
    }
  }, [user])

  const copyToClipboard = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopyMsg('Copied!')
    setTimeout(()=> setCopyMsg(''), 1200)
  }

  const runCode = () => {
    if (!connected) return
    setOutput('Running...')
    socketRef.current?.emit('compileCode', { code, roomId, language, version })
    if (outputPlacement === 'right') setRightPanel('output')
  }

  const createFile = () => {
    const base = language
    socketRef.current?.emit('fileCreate', { roomId, name: `file_${(files.length+1)}`, language: base })
  }
  const renameFile = (fid) => {
    const f = files.find(x => x._id === fid)
    const n = prompt('Rename file', f?.name || '')
    if (!n) return
    socketRef.current?.emit('fileRename', { roomId, fileId: fid, name: n })
  }
  const deleteFile = (fid) => {
    if (!confirm('Delete this file?')) return
    socketRef.current?.emit('fileDelete', { roomId, fileId: fid })
  }
  const switchFile = (fid) => {
    socketRef.current?.emit('fileSwitch', { roomId, fileId: fid })
  }

  const sendChat = () => {
    const txt = chatInput.trim()
    if (!txt) return
    const msg = { sender: name || 'Me', text: txt, time: Date.now() }
    socketRef.current?.emit('chatMessage', { roomId, ...msg })
    setMessages((prev)=> [...prev, msg])
    setChatInput('')
  }

  return (
    <div className="min-h-[calc(100vh-120px)] grid grid-cols-[56px_1fr] gap-4">
      {/* Left rail */}
      <aside className="sticky top-20 h-[calc(100vh-140px)] flex flex-col items-center gap-3 py-3 rounded-2xl bg-slate-900/70 border border-white/10">
        <button className={`w-10 h-10 rounded-full flex items-center justify-center ${rightPanel==='files'?'bg-blue-600 text-white':'bg-white/10 text-white/80 hover:bg-white/20'}`} onClick={()=> setRightPanel(rightPanel==='files'?null:'files')} title="Files">📄</button>
        <button className={`w-10 h-10 rounded-full flex items-center justify-center ${rightPanel==='users'?'bg-blue-600 text-white':'bg-white/10 text-white/80 hover:bg-white/20'}`} onClick={()=> setRightPanel(rightPanel==='users'?null:'users')} title="Participants">👥</button>
        <button className={`w-10 h-10 rounded-full flex items-center justify-center ${rightPanel==='chat'?'bg-blue-600 text-white':'bg-white/10 text-white/80 hover:bg-white/20'}`} onClick={()=> setRightPanel(rightPanel==='chat'?null:'chat')} title="Chat">💬</button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white/80 hover:bg-white/20" onClick={()=> copyToClipboard(code)} title="Copy code">📋</button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white/80 hover:bg-white/20" onClick={()=> copyToClipboard(roomId)} title="Copy room">🆔</button>
      </aside>

      {/* Main column */}
      <div className="space-y-4">
        {/* Top bar */}
        <div className="rounded-2xl bg-slate-900/70 border border-white/10 px-4 py-3 flex items-center gap-3">
          <div className="font-semibold text-white">Dev2Gether</div>
          <div className="ml-auto flex items-center gap-2">
            <input className="px-3 py-2 rounded border border-white/10 bg-slate-800/80 text-slate-100 w-44" placeholder="Your name" value={name} onChange={(e)=> setName(e.target.value)} />
            <input className="px-3 py-2 rounded border border-white/10 bg-slate-800/80 text-slate-100 w-44" placeholder="Room ID" value={roomId || ''} onChange={(e)=> nav(`/editor/${e.target.value}`)} />
            {!connected ? (
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={connect} disabled={!roomId||!name}>Connect</button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 rounded bg-emerald-600 text-white">Connected</span>
                <button className="px-3 py-2 rounded bg-rose-600 text-white" onClick={()=>{ try{ socketRef.current?.emit('leaveRoom') }catch{}; socketRef.current?.disconnect(); setConnected(false); setUsers([]); setMessages([]); setFiles([]); setActiveFileId(null); setOutput(''); }}>Leave</button>
              </div>
            )}
            <button className="px-4 py-2 rounded bg-slate-700 text-white" onClick={()=> nav(`/editor/${Math.random().toString(36).slice(2,10)}`)}>New Room</button>
          </div>
        </div>

        {connected && (
          <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-3">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <select className="px-3 py-2 rounded border border-white/10 bg-slate-800/80 text-slate-100" value={language} onChange={(e)=>{ const lang=e.target.value; setLanguage(lang); setVersion(DEFAULT_VERSIONS[lang]||'*'); socketRef.current?.emit('languageChange',{ roomId, language: lang }) }}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <input className="px-3 py-2 rounded border border-white/10 bg-slate-800/80 text-slate-100 w-24" value={version} onChange={(e)=> setVersion(e.target.value)} title="Runtime version" />
              <select className="px-3 py-2 rounded border border-white/10 bg-slate-800/80 text-slate-100" value={outputPlacement} onChange={(e)=>{ const p=e.target.value; setOutputPlacement(p); if (p==='right') setRightPanel('output'); else if (rightPanel==='output') setRightPanel(null) }} title="Output placement">
                <option value="bottom">Output below</option>
                <option value="top">Output above editor</option>
                <option value="right">Output right panel</option>
              </select>
              <div className="ml-auto flex items-center gap-2">
                <button className="px-3 py-1 rounded bg-slate-800/80 text-white" onClick={()=> setFontSize((s)=> Math.max(10,s-1))}>A-</button>
                <span className="text-sm text-white/80">{fontSize}px</span>
                <button className="px-3 py-1 rounded bg-slate-800/80 text-white" onClick={()=> setFontSize((s)=> Math.min(32,s+1))}>A+</button>
                <button className="px-3 py-1 rounded bg-slate-800/80 text-white" onClick={()=>{ const tpl=TEMPLATES[language]||''; setCode(tpl); socketRef.current?.emit('codeChange',{ roomId, code: tpl }) }}>Template</button>
                <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={()=> socketRef.current?.emit('fileSave', { roomId, fileId: activeFileId, content: code, language })}>Save</button>
              </div>
            </div>

            {/* Output on top */}
            {outputPlacement === 'top' && (
              <div className="mb-3 rounded-xl border border-white/10 bg-black/80">
                <textarea className="w-full h-32 rounded-xl px-3 py-2 bg-transparent text-green-200 font-mono text-sm" value={output} readOnly placeholder="Output will appear here." />
              </div>
            )}

            {/* File tabs */}
            <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar py-1">
              {files.map(f=> (
                <div key={f._id} className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer ${activeFileId===f._id?'bg-blue-600 text-white border-blue-500':'bg-slate-800 text-white/80 border-white/10'}`} onClick={()=> switchFile(f._id)}>
                  <span className="text-sm">{f.name}</span>
                  <button className="text-xs opacity-80 hover:opacity-100" onClick={(e)=>{ e.stopPropagation(); renameFile(f._id) }}>✏️</button>
                  <button className="text-xs opacity-80 hover:opacity-100" onClick={(e)=>{ e.stopPropagation(); deleteFile(f._id) }}>✖️</button>
                </div>
              ))}
              <button className="px-3 py-1 rounded-full bg-slate-700 text-white hover:bg-slate-600" onClick={createFile}>+ New File</button>
            </div>

            {/* Editor */}
            <div className="text-xs text-slate-400 mb-1 h-4">{typing}</div>
            <Editor height="52vh" defaultLanguage={language} language={language} theme="vs-dark" value={code} onChange={(v)=>{ const val=v||''; setCode(val); socketRef.current?.emit('codeChange',{ roomId, code: val }); socketRef.current?.emit('typing',{ roomId, userName: name || user?.name || 'User' }) }} options={{ minimap:{ enabled:false }, fontSize, scrollBeyondLastLine:false }} />

            {/* Execute button */}
            <div className="mt-3">
              <button className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50" onClick={runCode} disabled={!connected}>Execute</button>
            </div>

            {/* Output at bottom (default) */}
            {outputPlacement === 'bottom' && (
              <div className="mt-3">
                <textarea className="w-full h-40 rounded-lg px-3 py-2 bg-black text-green-200 border border-white/10 font-mono text-sm" value={output} readOnly placeholder="Output will appear here." />
              </div>
            )}
          </div>
        )}

        {/* Right overlay panel */}
        {rightPanel && (
          <div className="fixed right-4 top-24 bottom-6 w-80 rounded-2xl bg-slate-900/80 border border-white/10 p-3 overflow-y-auto">
            {rightPanel==='files' && (
              <>
                <h3 className="font-semibold text-white mb-3">Files</h3>
                <div className="space-y-2">
                  {files.length === 0 && (
                    <div className="text-sm text-white/60">No files yet. Use "+ New File" to create one.</div>
                  )}
                  {files.map((f)=> (
                    <div key={f._id} className={`flex items-center justify-between px-3 py-2 rounded border ${activeFileId===f._id?'bg-blue-600 text-white border-blue-500':'bg-white/5 text-white/80 border-white/10'}`}>
                      <button className="text-left flex-1" onClick={()=> switchFile(f._id)}>{f.name}</button>
                      <div className="flex items-center gap-2">
                        <button className="text-xs opacity-80 hover:opacity-100" onClick={()=> renameFile(f._id)}>✏️</button>
                        <button className="text-xs opacity-80 hover:opacity-100" onClick={()=> deleteFile(f._id)}>✖️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {rightPanel==='users' && (
              <>
                <h3 className="font-semibold text-white mb-2">Users in Room</h3>
                <ul className="space-y-1 text-sm text-white/80">
                  {users.map((u,i)=> (<li key={i} className="px-2 py-1 rounded bg-white/5">{typeof u==='string'?u:String(u)}</li>))}
                </ul>
              </>
            )}
            {rightPanel==='chat' && (
              <>
                <h3 className="font-semibold text-white mb-2">Room Chat</h3>
                <div className="h-64 overflow-y-auto bg-slate-900 text-slate-100 rounded p-2 mb-2 border border-white/10">
                  {messages.map((m,i)=> (<div key={i} className="text-sm mb-1"><b>{m.sender}:</b> <span>{m.text}</span></div>))}
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 rounded px-3 py-2 bg-white/5 border border-white/10 text-white" value={chatInput} onChange={(e)=> setChatInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && sendChat()} placeholder="Type a message and press Enter" />
                  <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={sendChat}>Send</button>
                </div>
              </>
            )}
            {rightPanel==='output' && (
              <>
                <h3 className="font-semibold text-white mb-2">Output</h3>
                <div className="h-[calc(100%-2rem)] overflow-y-auto bg-black/80 text-green-200 rounded p-2 border border-white/10">
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm">{output || 'Output will appear here.'}</pre>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}



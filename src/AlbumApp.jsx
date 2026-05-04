import React, { useState, useEffect, useRef } from 'react';
import { Plus, Filter, BarChart3, ArrowLeftRight, Camera, Loader2, Check, LogOut, Users, ChevronDown, Copy, Hash } from 'lucide-react';
import { supabase } from './supabaseClient';

const STICKERS_PER_TEAM = 20;

// ─── Hook: toque longo ────────────────────────────────────────────────────────
function useLongPress(onLongPress, delay = 500) {
  const timerRef = useRef(null);
  const startPosRef = useRef(null);

  const start = (e) => {
    const touch = e.touches?.[0];
    startPosRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(40);
      onLongPress();
    }, delay);
  };

  const cancel = () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const move = (e) => {
    if (!startPosRef.current || !timerRef.current) return;
    const touch = e.touches?.[0];
    if (!touch) return;
    const dx = touch.clientX - startPosRef.current.x;
    const dy = touch.clientY - startPosRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) cancel();
  };

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: move,
    onTouchCancel: cancel,
  };
}

// ─── Componente: botão de figurinha ──────────────────────────────────────────
function StickerButton({ style, count, onAdd, onRemove, children }) {
  const longPress = useLongPress(() => { if (count > 0) onRemove(); });

  return (
    <button
      style={{ ...style, userSelect: 'none', WebkitTouchCallout: 'none' }}
      onClick={e => { if (e.shiftKey && count > 0) onRemove(); else onAdd(); }}
      onContextMenu={e => { e.preventDefault(); if (count > 0) onRemove(); }}
      {...longPress}
    >
      {children}
    </button>
  );
}

// ─── Seções especiais ─────────────────────────────────────────────────────────
const SPECIAL_SECTIONS = [
  {
    id: 'somos26',
    name: 'Somos 26',
    color: '#7c3aed',
    stickers: [{ code: 'S26-00', label: '00' }],
  },
  {
    id: 'copa2026',
    name: 'Copa 2026',
    color: '#0055a4',
    stickers: [1, 2, 3, 4].map(n => ({ code: `C26-${n.toString().padStart(2,'0')}`, label: String(n) })),
  },
  {
    id: 'bola',
    name: 'Bola e País-Sede',
    color: '#0a7a3f',
    stickers: [5, 6, 7, 8].map(n => ({ code: `BP-${n.toString().padStart(2,'0')}`, label: String(n) })),
  },
  {
    id: 'historia',
    name: 'História da Copa',
    color: '#b45309',
    stickers: Array.from({ length: 11 }, (_, i) => ({ code: `HC-${(9+i).toString().padStart(2,'0')}`, label: String(9+i) })),
  },
  {
    id: 'extra',
    name: 'Extra Stickers',
    color: '#1a1a1a',
    stickers: [
      { code: 'EX-REGU', label: 'REGU' },
      { code: 'EX-BRON', label: 'BRON' },
      { code: 'EX-PRAT', label: 'PRAT' },
      { code: 'EX-OURO', label: 'OURO' },
    ],
  },
  {
    id: 'cocacola',
    name: 'Coleção Coca-Cola',
    color: '#dc2626',
    stickers: Array.from({ length: 14 }, (_, i) => ({ code: `CC-${(i+1).toString().padStart(2,'0')}`, label: String(i+1) })),
  },
];

// ─── Seleções por grupo ───────────────────────────────────────────────────────
const GROUPS = {
  A: [
    { code: 'MEX', name: 'México', flag: '🇲🇽' },
    { code: 'RSA', name: 'África do Sul', flag: '🇿🇦' },
    { code: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷' },
    { code: 'CZE', name: 'República Tcheca', flag: '🇨🇿' },
  ],
  B: [
    { code: 'CAN', name: 'Canadá', flag: '🇨🇦' },
    { code: 'BIH', name: 'Bósnia e Herzegovina', flag: '🇧🇦' },
    { code: 'QAT', name: 'Catar', flag: '🇶🇦' },
    { code: 'SUI', name: 'Suíça', flag: '🇨🇭' },
  ],
  C: [
    { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
    { code: 'MAR', name: 'Marrocos', flag: '🇲🇦' },
    { code: 'HAI', name: 'Haiti', flag: '🇭🇹' },
    { code: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  ],
  D: [
    { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'PAR', name: 'Paraguai', flag: '🇵🇾' },
    { code: 'AUS', name: 'Austrália', flag: '🇦🇺' },
    { code: 'TUR', name: 'Turquia', flag: '🇹🇷' },
  ],
  E: [
    { code: 'GER', name: 'Alemanha', flag: '🇩🇪' },
    { code: 'CUW', name: 'Curaçao', flag: '🇨🇼' },
    { code: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮' },
    { code: 'ECU', name: 'Equador', flag: '🇪🇨' },
  ],
  F: [
    { code: 'NED', name: 'Holanda', flag: '🇳🇱' },
    { code: 'JPN', name: 'Japão', flag: '🇯🇵' },
    { code: 'SWE', name: 'Suécia', flag: '🇸🇪' },
    { code: 'TUN', name: 'Tunísia', flag: '🇹🇳' },
  ],
  G: [
    { code: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
    { code: 'EGY', name: 'Egito', flag: '🇪🇬' },
    { code: 'IRN', name: 'Irã', flag: '🇮🇷' },
    { code: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿' },
  ],
  H: [
    { code: 'ESP', name: 'Espanha', flag: '🇪🇸' },
    { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' },
    { code: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦' },
    { code: 'URU', name: 'Uruguai', flag: '🇺🇾' },
  ],
  I: [
    { code: 'FRA', name: 'França', flag: '🇫🇷' },
    { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
    { code: 'IRQ', name: 'Iraque', flag: '🇮🇶' },
    { code: 'NOR', name: 'Noruega', flag: '🇳🇴' },
  ],
  J: [
    { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
    { code: 'ALG', name: 'Argélia', flag: '🇩🇿' },
    { code: 'AUT', name: 'Áustria', flag: '🇦🇹' },
    { code: 'JOR', name: 'Jordânia', flag: '🇯🇴' },
  ],
  K: [
    { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
    { code: 'COD', name: 'RD Congo', flag: '🇨🇩' },
    { code: 'UZB', name: 'Uzbequistão', flag: '🇺🇿' },
    { code: 'COL', name: 'Colômbia', flag: '🇨🇴' },
  ],
  L: [
    { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'CRO', name: 'Croácia', flag: '🇭🇷' },
    { code: 'GHA', name: 'Gana', flag: '🇬🇭' },
    { code: 'PAN', name: 'Panamá', flag: '🇵🇦' },
  ],
};

const ALL_TEAMS = Object.entries(GROUPS).flatMap(([group, teams]) =>
  teams.map(t => ({ ...t, group }))
);

const SPECIAL_TOTAL = SPECIAL_SECTIONS.reduce((acc, s) => acc + s.stickers.length, 0);
const TOTAL_STICKERS = ALL_TEAMS.length * STICKERS_PER_TEAM + SPECIAL_TOTAL;

const genCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handle = async () => {
    if (!email || !password) { setError('Preencha email e senha.'); return; }
    setLoading(true); setError('');
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setRegistered(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (registered) {
    return (
      <div style={ls.wrap}>
        <div style={ls.card}>
          <div style={ls.eyebrow}>FIFA WORLD CUP 2026™</div>
          <h1 style={ls.title}>Álbum Panini</h1>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📧</div>
            <p style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a', margin: '0 0 8px' }}>Confirme seu e-mail</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 4px', lineHeight: 1.6 }}>
              Enviamos um link de confirmação para:
            </p>
            <p style={{ fontWeight: 700, color: '#003a70', fontSize: '14px', margin: '0 0 16px', wordBreak: 'break-all' }}>{email}</p>
            <p style={{ fontSize: '13px', color: '#888', margin: 0, lineHeight: 1.6 }}>
              Acesse seu e-mail e clique no link para ativar sua conta. Após confirmar, volte aqui para entrar.
            </p>
          </div>
          <button onClick={() => { setRegistered(false); setIsRegister(false); setPassword(''); }} style={ls.btn}>
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={ls.wrap}>
      <div style={ls.card}>
        <div style={ls.eyebrow}>FIFA WORLD CUP 2026™</div>
        <h1 style={ls.title}>Álbum Panini</h1>
        <p style={ls.hint}>{isRegister ? 'Crie sua conta para começar' : 'Entre para acessar seu álbum'}</p>
        {error && <div style={ls.error}>{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} style={ls.input} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} style={ls.input} />
        <button onClick={handle} disabled={loading} style={ls.btn}>{loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}</button>
        <button onClick={() => { setIsRegister(!isRegister); setError(''); }} style={ls.toggle}>
          {isRegister ? 'Já tenho conta — Entrar' : 'Não tenho conta — Criar'}
        </button>
      </div>
    </div>
  );
}

const ls = {
  wrap: { minHeight: '100vh', background: '#003a70', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', sans-serif" },
  card: { background: '#fff', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' },
  eyebrow: { fontSize: '11px', letterSpacing: '2px', color: '#888', textAlign: 'center' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', margin: 0, textAlign: 'center', color: '#003a70', letterSpacing: '1px' },
  hint: { fontSize: '14px', color: '#666', textAlign: 'center', margin: 0 },
  input: { padding: '12px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit' },
  btn: { padding: '13px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  toggle: { background: 'none', border: 'none', color: '#0055a4', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', fontFamily: 'inherit' },
  error: { background: '#fef2f2', color: '#c5331a', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' },
};

// ─── Seleção de Álbum ─────────────────────────────────────────────────────────
function AlbumSelector({ session, albums, onSelect, onCreateAlbum, onJoinAlbum, onDeleteAlbum }) {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [albumName, setAlbumName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // album a excluir

  const deleteAlbum = async (album) => {
    setLoading(true); setError('');
    try {
      const r1 = await supabase.from('stickers').delete().eq('album_id', album.id);
      if (r1.error) throw new Error('Erro ao apagar figurinhas: ' + r1.error.message);

      const r2 = await supabase.from('album_members').delete().eq('album_id', album.id);
      if (r2.error) throw new Error('Erro ao apagar membros: ' + r2.error.message);

      const r3 = await supabase.from('albums').delete().eq('id', album.id);
      if (r3.error) throw new Error('Erro ao apagar álbum: ' + r3.error.message);

      setConfirmDelete(null);
      onDeleteAlbum(album.id);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const createAlbum = async () => {
    if (!albumName.trim()) { setError('Digite um nome para o álbum.'); return; }
    setLoading(true); setError('');
    try {
      const code = genCode();
      const { data: album, error: err } = await supabase
        .from('albums').insert({ name: albumName.trim(), invite_code: code }).select().single();
      if (err) throw err;
      await supabase.from('album_members').insert({ album_id: album.id, user_id: session.user.id });
      onCreateAlbum(album);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const joinAlbum = async () => {
    if (!joinCode.trim()) { setError('Digite o código do álbum.'); return; }
    setLoading(true); setError('');
    try {
      const { data: album, error: err } = await supabase
        .from('albums').select('*').eq('invite_code', joinCode.trim().toUpperCase()).single();
      if (err || !album) { setError('Código inválido. Verifique e tente novamente.'); setLoading(false); return; }
      const { data: existing } = await supabase.from('album_members').select('album_id')
        .eq('album_id', album.id).eq('user_id', session.user.id).single();
      if (!existing) await supabase.from('album_members').insert({ album_id: album.id, user_id: session.user.id });
      onJoinAlbum(album);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={ls.wrap}>
      <div style={{ ...ls.card, maxWidth: '480px', gap: '16px' }}>
        <div style={ls.eyebrow}>FIFA WORLD CUP 2026™</div>
        <h1 style={ls.title}>Meus Álbuns</h1>
        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', margin: 0 }}>{session.user.email}</p>

        {/* Modal de confirmação de exclusão */}
        {confirmDelete && (
          <div style={{ background: '#fff3f3', border: '1.5px solid #fca5a5', borderRadius: '12px', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#c5331a' }}>🗑️ Excluir álbum?</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
              Tem certeza que deseja excluir <strong>"{confirmDelete.name}"</strong>? Todas as figurinhas serão apagadas permanentemente. Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => deleteAlbum(confirmDelete)} disabled={loading}
                style={{ ...ls.btn, background: '#c5331a', flex: 1, fontSize: '14px', padding: '10px' }}>
                {loading ? 'Excluindo...' : 'Sim, excluir'}
              </button>
              <button onClick={() => setConfirmDelete(null)}
                style={{ ...ls.btn, background: '#e5e1d8', color: '#333', flex: 1, fontSize: '14px', padding: '10px' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {albums.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Selecione um álbum</p>
            {albums.map(album => (
              <div key={album.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => onSelect(album)}
                  style={{ flex: 1, padding: '14px 16px', background: '#f4f1ea', border: '2px solid #e5e1d8', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>📋 {album.name}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '3px', fontFamily: 'monospace', letterSpacing: '1px' }}>Código: <strong>{album.invite_code}</strong></div>
                </button>
                <button onClick={() => setConfirmDelete(album)}
                  title="Excluir álbum"
                  style={{ padding: '0', width: '44px', height: '70px', background: '#fff0f0', border: '2px solid #fca5a5', borderRadius: '10px', cursor: 'pointer', color: '#c5331a', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', transition: 'all 0.15s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5331a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3px', color: '#c5331a' }}>APAGAR</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <div style={ls.error}>{error}</div>}

        {!mode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: albums.length ? '4px' : 0 }}>
            <button onClick={() => setMode('create')} style={ls.btn}>+ Criar novo álbum</button>
            <button onClick={() => setMode('join')} style={{ ...ls.btn, background: '#0a7a3f' }}>🔗 Entrar com código</button>
            <button onClick={() => supabase.auth.signOut()} style={{ ...ls.btn, background: 'transparent', color: '#aaa', fontSize: '13px', padding: '8px' }}>Sair da conta</button>
          </div>
        )}

        {mode === 'create' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Nome do álbum:</p>
            <input placeholder="Ex: Família, Amigos..." value={albumName} onChange={e => setAlbumName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createAlbum()} style={ls.input} autoFocus />
            <button onClick={createAlbum} disabled={loading} style={ls.btn}>{loading ? 'Criando...' : 'Criar álbum'}</button>
            <button onClick={() => { setMode(null); setError(''); }} style={{ ...ls.btn, background: '#e5e1d8', color: '#333' }}>Cancelar</button>
          </div>
        )}

        {mode === 'join' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Código do álbum:</p>
            <input placeholder="Ex: ABC123" value={joinCode} onChange={e => setJoinCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && joinAlbum()}
              style={{ ...ls.input, textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700, fontSize: '18px', textAlign: 'center' }} autoFocus />
            <button onClick={joinAlbum} disabled={loading} style={{ ...ls.btn, background: '#0a7a3f' }}>{loading ? 'Entrando...' : 'Entrar no álbum'}</button>
            <button onClick={() => { setMode(null); setError(''); }} style={{ ...ls.btn, background: '#e5e1d8', color: '#333' }}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function AlbumApp() {
  const [session, setSession] = useState(undefined);
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [collection, setCollection] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('collection');
  const [collectionView, setCollectionView] = useState('teams'); // 'teams' | 'special'
  const [filter, setFilter] = useState({ group: 'all', team: 'all' });
  const [feedback, setFeedback] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult, setPhotoResult] = useState(null);
  const [showAlbumMenu, setShowAlbumMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setAlbums([]); setCurrentAlbum(null); setCollection({}); return; }
    loadAlbums();
  }, [session]);

  const loadAlbums = async () => {
    setLoadingData(true);
    try {
      const { data: memberships } = await supabase.from('album_members').select('album_id').eq('user_id', session.user.id);
      if (!memberships?.length) { setLoadingData(false); return; }
      const ids = memberships.map(m => m.album_id);
      const { data: albumsData } = await supabase.from('albums').select('*').in('id', ids).order('created_at');
      setAlbums(albumsData || []);
    } catch (e) { console.error(e); }
    finally { setLoadingData(false); }
  };

  const selectAlbum = async (album) => {
    setCurrentAlbum(album);
    setCollection({});
    setShowAlbumMenu(false);
    await fetchStickers(album.id);
  };

  const fetchStickers = async (aid) => {
    const { data } = await supabase.from('stickers').select('code, count').eq('album_id', aid);
    const col = {};
    data?.forEach(({ code, count }) => { col[code] = count; });
    setCollection(col);
  };

  useEffect(() => {
    if (!currentAlbum) return;
    const channel = supabase.channel(`album-${currentAlbum.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers', filter: `album_id=eq.${currentAlbum.id}` },
        () => fetchStickers(currentAlbum.id))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentAlbum]);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 2500);
  };

  const parseSticker = (raw) => {
    const cleaned = raw.trim().toUpperCase().replace(/[\s-]/g, '');
    const match = cleaned.match(/^([A-Z]{2,4})(\d{1,3})$/);
    if (!match) return null;
    const [, code, num] = match;
    const team = ALL_TEAMS.find(t => t.code === code);
    if (!team) return null;
    const number = parseInt(num);
    if (number < 1 || number > STICKERS_PER_TEAM) return null;
    return { code, number, team };
  };

  const upsertSticker = async (key, newCount) => {
    if (!currentAlbum) return;
    if (newCount <= 0) {
      await supabase.from('stickers').delete().eq('album_id', currentAlbum.id).eq('code', key);
    } else {
      await supabase.from('stickers').upsert(
        { album_id: currentAlbum.id, code: key, count: newCount, added_by: session.user.id, updated_at: new Date().toISOString() },
        { onConflict: 'album_id,code' }
      );
    }
  };

  const addSticker = async (rawInput) => {
    const entries = rawInput.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
    let added = 0; let invalid = [];
    const newCollection = { ...collection };
    for (const entry of entries) {
      const parsed = parseSticker(entry);
      if (!parsed) { invalid.push(entry); continue; }
      const key = `${parsed.code}${parsed.number}`;
      newCollection[key] = (newCollection[key] || 0) + 1;
      added++;
    }
    setCollection(newCollection);
    const promises = entries.map(e => parseSticker(e)).filter(Boolean).map(parsed => {
      const key = `${parsed.code}${parsed.number}`;
      return upsertSticker(key, newCollection[key]);
    });
    await Promise.all(promises);
    if (added > 0 && invalid.length === 0) showFeedback(`${added} figurinha${added > 1 ? 's' : ''} adicionada${added > 1 ? 's' : ''}!`);
    else if (added > 0) showFeedback(`${added} adicionadas. Inválidas: ${invalid.join(', ')}`, 'warning');
    else showFeedback(`Formato inválido: ${invalid.join(', ')}`, 'error');
  };

  const handleSubmit = () => { if (!input.trim()) return; addSticker(input); setInput(''); };

  const addStickerByKey = async (key) => {
    const newCount = (collection[key] || 0) + 1;
    setCollection(prev => ({ ...prev, [key]: newCount }));
    await upsertSticker(key, newCount);
    showFeedback(`${key} adicionada!`);
  };

  const removeOne = async (key) => {
    const newCount = (collection[key] || 1) - 1;
    const newCollection = { ...collection };
    if (newCount <= 0) delete newCollection[key]; else newCollection[key] = newCount;
    setCollection(newCollection);
    await upsertSticker(key, newCount);
  };

  const setCount = async (key, count) => {
    const newCollection = { ...collection };
    if (count <= 0) delete newCollection[key]; else newCollection[key] = count;
    setCollection(newCollection);
    await upsertSticker(key, count);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true); setPhotoResult(null);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = () => rej(new Error('Falha'));
        r.readAsDataURL(file);
      });
      const validCodes = ALL_TEAMS.map(t => t.code).join(', ');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
            { type: 'text', text: `Identifique todas as figurinhas da Copa do Mundo 2026 (Panini) nesta imagem. Cada figurinha tem um código no formato SIGLA+NÚMERO (ex: BRA12, ARG5, FRA18). Códigos válidos: ${validCodes}. Números vão de 1 a ${STICKERS_PER_TEAM}. Responda APENAS um JSON no formato {"stickers": ["BRA12", "ARG5"]}, sem texto extra.` }
          ]}]
        }),
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === 'text')?.text || '';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      if (parsed.stickers?.length > 0) setPhotoResult(parsed.stickers);
      else showFeedback('Nenhuma figurinha identificada na foto', 'warning');
    } catch { showFeedback('Erro ao processar foto. Tente novamente.', 'error'); }
    finally { setPhotoLoading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const confirmPhotoStickers = () => { addSticker(photoResult.join(' ')); setPhotoResult(null); };

  const copyCode = () => {
    navigator.clipboard.writeText(currentAlbum.invite_code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  // Stats
  const uniqueCount = Object.keys(collection).length;
  const totalCount = Object.values(collection).reduce((a, b) => a + b, 0);
  const repeats = Object.entries(collection).filter(([, count]) => count > 1);
  const repeatCount = repeats.reduce((acc, [, count]) => acc + (count - 1), 0);
  const progressPct = ((uniqueCount / TOTAL_STICKERS) * 100).toFixed(1);

  const filteredTeams = ALL_TEAMS.filter(t => {
    if (filter.group !== 'all' && t.group !== filter.group) return false;
    if (filter.team !== 'all' && t.code !== filter.team) return false;
    return true;
  });

  const teamProgress = (code) => {
    let owned = 0;
    for (let i = 1; i <= STICKERS_PER_TEAM; i++) if (collection[`${code}${i}`]) owned++;
    return owned;
  };

  const specialProgress = (section) => section.stickers.filter(s => collection[s.code] > 0).length;

  // Guards
  if (session === undefined) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#003a70', color: '#fff', fontFamily: 'sans-serif' }}>Carregando...</div>;
  if (!session) return <LoginScreen />;
  if (loadingData) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f1ea', fontFamily: 'sans-serif' }}>Carregando...</div>;
  if (!currentAlbum) return (
    <AlbumSelector session={session} albums={albums} onSelect={selectAlbum}
      onCreateAlbum={async (album) => { await loadAlbums(); selectAlbum(album); }}
      onJoinAlbum={async (album) => { await loadAlbums(); selectAlbum(album); }}
      onDeleteAlbum={async (deletedId) => { setAlbums(prev => prev.filter(a => a.id !== deletedId)); await loadAlbums(); }}
    />
  );

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={styles.eyebrow}>FIFA WORLD CUP 2026™</div>
            <button onClick={() => setShowAlbumMenu(!showAlbumMenu)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <h1 style={{ ...styles.title, margin: 0 }}>{currentAlbum.name}</h1>
              <ChevronDown size={20} style={{ marginTop: '4px', opacity: 0.8 }} />
            </button>
            {showAlbumMenu && (
              <div style={styles.albumMenu}>
                <div style={{ padding: '8px 12px 4px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Seus álbuns</div>
                {albums.map(a => (
                  <button key={a.id} onClick={() => selectAlbum(a)}
                    style={{ ...styles.albumMenuItem, ...(a.id === currentAlbum.id ? styles.albumMenuItemActive : {}) }}>
                    📋 {a.name}
                    <span style={{ fontSize: '11px', color: '#888', marginLeft: 'auto', fontFamily: 'monospace' }}>{a.invite_code}</span>
                  </button>
                ))}
                <hr style={{ border: 'none', borderTop: '1px solid #e5e1d8', margin: '4px 0' }} />
                <button onClick={() => { setCurrentAlbum(null); setShowAlbumMenu(false); }} style={{ ...styles.albumMenuItem, color: '#0055a4' }}>
                  + Criar / Entrar em outro álbum
                </button>
                <button onClick={() => supabase.auth.signOut()} style={{ ...styles.albumMenuItem, color: '#c5331a' }}>
                  <LogOut size={14} /> Sair da conta
                </button>
              </div>
            )}
          </div>
          <div style={styles.statBlock}>
            <div style={styles.statBig}>{progressPct}%</div>
            <div style={styles.statSmall}>{uniqueCount} / {TOTAL_STICKERS}</div>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>
      </header>

      <nav style={styles.tabs}>
        {[
          { id: 'input', label: 'Adicionar', icon: Plus },
          { id: 'collection', label: 'Coleção', icon: Filter },
          { id: 'repeats', label: `Repetidas${repeatCount > 0 ? ` (${repeatCount})` : ''}`, icon: ArrowLeftRight },
          { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
          { id: 'invite', label: 'Compartilhar', icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ ...styles.tab, ...(activeTab === id ? styles.tabActive : {}) }}>
            <Icon size={16} /><span>{label}</span>
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {feedback && (
          <div style={{ ...styles.feedback, ...(feedback.type === 'error' ? styles.feedbackError : {}), ...(feedback.type === 'warning' ? styles.feedbackWarning : {}) }}>
            {feedback.msg}
          </div>
        )}

        {/* ── ADICIONAR ─────────────────────────────────────────────────── */}
        {activeTab === 'input' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Digitar figurinhas</h2>
              <p style={styles.cardHint}>Formato: <code style={styles.code}>SIGLA + NÚMERO</code>. Ex: <code style={styles.code}>BRA12</code>. Para várias: <code style={styles.code}>BRA1 ARG5 FRA18</code></p>
              <div style={styles.inputRow}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="BRA12, ARG5..." style={styles.input} />
                <button onClick={handleSubmit} style={styles.primaryBtn}>Adicionar</button>
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Importar por foto</h2>
              <p style={styles.cardHint}>Tire uma foto das figurinhas. A IA tenta identificar os códigos automaticamente.</p>
              {!photoResult && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={photoLoading}
                    style={{ ...styles.primaryBtn, width: '100%', justifyContent: 'center', padding: '14px', ...(photoLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                    {photoLoading ? <><Loader2 size={18} className="spin" />Analisando...</> : <><Camera size={18} />Tirar foto / Escolher imagem</>}
                  </button>
                </>
              )}
              {photoResult && (
                <div style={{ background: '#f4f1ea', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px' }}><Check size={18} color="#0a7a3f" /><strong>Identificadas {photoResult.length} figurinhas:</strong></div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {photoResult.map((code, i) => <span key={i} style={{ background: '#fff', border: '1px solid #003a70', color: '#003a70', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{code}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={confirmPhotoStickers} style={styles.primaryBtn}>Adicionar todas</button>
                    <button onClick={() => setPhotoResult(null)} style={styles.secondaryBtn}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── COLEÇÃO ───────────────────────────────────────────────────── */}
        {activeTab === 'collection' && (
          <div style={styles.section}>
            {/* Sub-tabs: Seleções / Especiais */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setCollectionView('teams')}
                style={{ ...styles.subTab, ...(collectionView === 'teams' ? styles.subTabActive : {}) }}>
                🌍 Todos os Países
              </button>
              <button onClick={() => setCollectionView('special')}
                style={{ ...styles.subTab, ...(collectionView === 'special' ? styles.subTabActive : {}) }}>
                ⭐ Figurinhas Especiais
              </button>
            </div>

            {collectionView === 'teams' && (
              <>
                <div style={styles.helpBox}>
                  <strong>Como usar:</strong> toque ou clique para adicionar. <strong>Toque longo</strong> (celular) para remover. No desktop: <kbd style={styles.kbd}>Shift</kbd> + clique ou botão direito.
                </div>
                <div style={styles.filterRow}>
                  <select value={filter.group} onChange={e => setFilter({ group: e.target.value, team: 'all' })} style={styles.select}>
                    <option value="all">Todos os grupos</option>
                    {Object.keys(GROUPS).map(g => <option key={g} value={g}>Grupo {g}</option>)}
                  </select>
                  <select value={filter.team} onChange={e => setFilter({ ...filter, team: e.target.value })} style={styles.select}>
                    <option value="all">Todas as seleções</option>
                    {(filter.group === 'all' ? ALL_TEAMS : GROUPS[filter.group]).map(t => <option key={t.code} value={t.code}>{t.flag} {t.name}</option>)}
                  </select>
                </div>
                {filteredTeams.map(team => {
                  const owned = teamProgress(team.code);
                  return (
                    <div key={team.code} style={styles.teamCard}>
                      <div style={styles.teamHeader}>
                        <div style={styles.teamHeaderLeft}>
                          <span style={styles.teamFlag}>{team.flag}</span>
                          <div>
                            <div style={styles.teamName}>{team.name}</div>
                            <div style={styles.teamMeta}>Grupo {team.group} · {team.code}</div>
                          </div>
                        </div>
                        <div style={styles.teamProgress}><strong>{owned}</strong><span>/{STICKERS_PER_TEAM}</span></div>
                      </div>
                      <div style={styles.stickerGrid}>
                        {Array.from({ length: STICKERS_PER_TEAM }, (_, i) => {
                          const num = i + 1;
                          const key = `${team.code}${num}`;
                          const count = collection[key] || 0;
                          return (
                            <StickerButton key={num}
                              style={{ ...styles.stickerCell, ...(count > 0 ? styles.stickerOwned : {}), ...(count > 1 ? styles.stickerDuplicate : {}) }}
                              count={count}
                              onAdd={() => addStickerByKey(key)}
                              onRemove={() => removeOne(key)}>
                              <span style={styles.stickerCode}>{team.code}</span>
                              <span style={styles.stickerNum}>{num}</span>
                              {count > 1 && <span style={styles.stickerBadge}>{count}</span>}
                            </StickerButton>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {collectionView === 'special' && (
              <>
                <div style={styles.helpBox}>
                  <strong>Figurinhas especiais:</strong> toque ou clique para adicionar. <strong>Toque longo</strong> (celular) para remover. No desktop: <kbd style={styles.kbd}>Shift</kbd> + clique ou botão direito.
                </div>
                {SPECIAL_SECTIONS.map(section => {
                  const owned = specialProgress(section);
                  return (
                    <div key={section.id} style={styles.teamCard}>
                      <div style={styles.teamHeader}>
                        <div style={styles.teamHeaderLeft}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⭐</div>
                          <div>
                            <div style={styles.teamName}>{section.name}</div>
                            <div style={styles.teamMeta}>{section.stickers.length} figurinha{section.stickers.length > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        <div style={styles.teamProgress}><strong>{owned}</strong><span>/{section.stickers.length}</span></div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {section.stickers.map(sticker => {
                          const count = collection[sticker.code] || 0;
                          return (
                            <StickerButton key={sticker.code}
                              style={{ padding: '10px 16px', borderRadius: '8px', border: `2px solid ${count > 0 ? section.color : '#d4cdc0'}`, background: count > 0 ? section.color : 'transparent', color: count > 0 ? '#fff' : '#aaa', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', position: 'relative', transition: 'all 0.15s' }}
                              count={count}
                              onAdd={() => addStickerByKey(sticker.code)}
                              onRemove={() => removeOne(sticker.code)}>
                              {sticker.label}
                              {count > 1 && <span style={{ ...styles.stickerBadge, background: '#1a1a1a' }}>{count}</span>}
                            </StickerButton>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ── REPETIDAS ─────────────────────────────────────────────────── */}
        {activeTab === 'repeats' && (
          <div style={styles.section}>
            <div style={styles.helpBox}>
              <strong>Trocou figurinhas?</strong> Use <kbd style={styles.kbd}>−</kbd> e <kbd style={styles.kbd}>+</kbd> pra ajustar. O botão <strong>Troquei todas</strong> remove as cópias extras.
            </div>
            <div style={styles.card}>
              <div style={styles.repeatsHeader}>
                <h2 style={styles.cardTitle}>Repetidas {repeatCount > 0 && `(${repeatCount})`}</h2>
                {repeats.length > 0 && (
                  <button onClick={async () => {
                    if (confirm(`Remover todas as ${repeatCount} cópias extras?`)) {
                      const newCollection = { ...collection };
                      for (const [key] of repeats) { newCollection[key] = 1; await upsertSticker(key, 1); }
                      setCollection(newCollection);
                      showFeedback(`${repeatCount} repetidas removidas!`);
                    }
                  }} style={styles.dangerBtn}>Limpar todas</button>
                )}
              </div>
              {repeats.length === 0 ? (
                <p style={styles.empty}>Nenhuma repetida ainda. Bora colar!</p>
              ) : (
                <div style={styles.repeatsList}>
                  {repeats.sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => {
                    const match = key.match(/^([A-Z0-9-]+?)(\d+)$/);
                    const team = match ? ALL_TEAMS.find(t => t.code === match[1]) : null;
                    const special = SPECIAL_SECTIONS.flatMap(s => s.stickers).find(s => s.code === key);
                    return (
                      <div key={key} style={styles.repeatRow}>
                        <div style={styles.repeatLeft}>
                          <span style={styles.repeatFlag}>{team?.flag || '⭐'}</span>
                          <div>
                            <div style={styles.repeatCode}>{key}</div>
                            <div style={styles.repeatTeam}>{team?.name || special?.label || key}</div>
                          </div>
                        </div>
                        <div style={styles.repeatRight}>
                          <div style={styles.stepper}>
                            <button onClick={() => removeOne(key)} style={styles.stepBtn}>−</button>
                            <span style={styles.stepCount}>{count}</span>
                            <button onClick={() => addStickerByKey(key)} style={styles.stepBtn}>+</button>
                          </div>
                          <button onClick={async () => { await setCount(key, 1); showFeedback(`Cópias de ${key} removidas!`); }} style={styles.tradeBtn}>Troquei todas</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ESTATÍSTICAS ──────────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div style={styles.section}>
            <div style={styles.statsGrid}>
              {[
                { label: 'Coladas (únicas)', value: uniqueCount, footer: `de ${TOTAL_STICKERS}` },
                { label: 'Total na coleção', value: totalCount, footer: 'incluindo repetidas' },
                { label: 'Repetidas', value: repeatCount, footer: 'para troca' },
                { label: 'Faltam', value: TOTAL_STICKERS - uniqueCount, footer: 'figurinhas' },
              ].map(s => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statLabel}>{s.label}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statFooter}>{s.footer}</div>
                </div>
              ))}
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Progresso — Figurinhas Especiais</h2>
              <div style={styles.progressList}>
                {SPECIAL_SECTIONS.map(section => {
                  const owned = specialProgress(section);
                  const pct = (owned / section.stickers.length) * 100;
                  return (
                    <div key={section.id} style={styles.progressRow}>
                      <div style={styles.progressLabel}><span>⭐</span><span>{section.name}</span></div>
                      <div style={styles.progressBarSm}><div style={{ ...styles.progressFillSm, width: `${pct}%`, background: section.color, ...(pct === 100 ? { background: '#0a7a3f' } : {}) }} /></div>
                      <div style={styles.progressNum}>{owned}/{section.stickers.length}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Progresso — Seleções</h2>
              <div style={styles.progressList}>
                {ALL_TEAMS.map(team => {
                  const owned = teamProgress(team.code);
                  const pct = (owned / STICKERS_PER_TEAM) * 100;
                  return (
                    <div key={team.code} style={styles.progressRow}>
                      <div style={styles.progressLabel}><span>{team.flag}</span><span>{team.name}</span></div>
                      <div style={styles.progressBarSm}><div style={{ ...styles.progressFillSm, width: `${pct}%`, ...(pct === 100 ? { background: '#0a7a3f' } : {}) }} /></div>
                      <div style={styles.progressNum}>{owned}/{STICKERS_PER_TEAM}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPARTILHAR ──────────────────────────────────────────────── */}
        {activeTab === 'invite' && (
          <div style={styles.section}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Código do álbum</h2>
              <p style={styles.cardHint}>Compartilhe esse código. A pessoa entra no app → "Entrar com código" → cola aqui embaixo.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f4f1ea', borderRadius: '10px', padding: '16px 20px', marginBottom: '8px' }}>
                <Hash size={20} color="#003a70" />
                <span style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 900, letterSpacing: '4px', color: '#003a70', flex: 1 }}>{currentAlbum.invite_code}</span>
                <button onClick={copyCode} style={{ ...styles.primaryBtn, padding: '8px 14px', fontSize: '13px' }}>
                  {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Álbum atual</h2>
              <p style={styles.cardHint}>Nome: <strong>{currentAlbum.name}</strong><br />Conta: <strong>{session.user.email}</strong></p>
              <button onClick={() => setCurrentAlbum(null)} style={styles.secondaryBtn}>← Trocar de álbum</button>
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        {currentAlbum.name} · sincronizado em tempo real · 48 seleções · {TOTAL_STICKERS} figurinhas
      </footer>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  input, select, button { font-family: inherit; }
  input::placeholder { color: #999; }
  button:hover:not(:disabled) { opacity: 0.9; }
  button:active:not(:disabled) { transform: translateY(1px); }
`;

const styles = {
  app: { fontFamily: "'DM Sans', sans-serif", background: '#f4f1ea', minHeight: '100vh', color: '#1a1a1a', paddingBottom: '40px' },
  header: { background: 'linear-gradient(135deg, #003a70 0%, #0055a4 100%)', color: '#fff', padding: '24px 20px 0', position: 'relative' },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '900px', margin: '0 auto', paddingBottom: '16px' },
  eyebrow: { fontSize: '11px', letterSpacing: '2px', opacity: 0.8, marginBottom: '4px' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px', margin: 0, letterSpacing: '1px', lineHeight: 1 },
  albumMenu: { position: 'absolute', top: '110%', left: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 100, minWidth: '280px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' },
  albumMenuItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#1a1a1a', textAlign: 'left', width: '100%' },
  albumMenuItemActive: { background: '#f4f1ea', fontWeight: 700 },
  statBlock: { textAlign: 'right' },
  statBig: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', lineHeight: 1, color: '#ffd400' },
  statSmall: { fontSize: '12px', opacity: 0.8, marginTop: '2px' },
  progressBar: { height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden', maxWidth: '900px', margin: '0 auto' },
  progressFill: { height: '100%', background: '#ffd400', transition: 'width 0.3s ease' },
  tabs: { display: 'flex', gap: '4px', padding: '12px 20px', overflowX: 'auto', background: '#fff', borderBottom: '1px solid #e5e1d8', maxWidth: '900px', margin: '0 auto' },
  tab: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: 'none', background: 'transparent', color: '#666', fontSize: '13px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', whiteSpace: 'nowrap' },
  tabActive: { background: '#003a70', color: '#fff' },
  subTab: { padding: '8px 16px', border: '2px solid #e5e1d8', borderRadius: '8px', background: '#fff', color: '#666', fontWeight: 600, fontSize: '13px', cursor: 'pointer' },
  subTabActive: { border: '2px solid #003a70', background: '#003a70', color: '#fff' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e5e1d8' },
  cardTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', margin: '0 0 8px', letterSpacing: '0.5px' },
  cardHint: { fontSize: '13px', color: '#666', margin: '0 0 16px', lineHeight: 1.5 },
  code: { background: '#f4f1ea', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '12px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '15px', outline: 'none', textTransform: 'uppercase' },
  primaryBtn: { padding: '12px 20px', background: '#003a70', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
  secondaryBtn: { padding: '12px 20px', background: '#fff', color: '#1a1a1a', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  feedback: { background: '#0a7a3f', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 },
  feedbackError: { background: '#c5331a' },
  feedbackWarning: { background: '#d97706' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  helpBox: { background: '#fff8e1', border: '1px solid #f5d782', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#5c4a14', lineHeight: 1.5 },
  kbd: { background: '#fff', border: '1px solid #d4cdc0', borderRadius: '4px', padding: '1px 6px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 },
  select: { padding: '10px 14px', border: '2px solid #e5e1d8', borderRadius: '8px', fontSize: '14px', background: '#fff', flex: 1, minWidth: '140px', cursor: 'pointer' },
  teamCard: { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e1d8' },
  teamHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  teamHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  teamFlag: { fontSize: '32px' },
  teamName: { fontWeight: 700, fontSize: '16px' },
  teamMeta: { fontSize: '12px', color: '#888', marginTop: '2px' },
  teamProgress: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px' },
  stickerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: '6px' },
  stickerCell: { aspectRatio: '1', border: '2px dashed #d4cdc0', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', color: '#aaa', position: 'relative', cursor: 'pointer', background: 'transparent', padding: '2px', transition: 'all 0.15s', fontFamily: 'inherit' },
  stickerOwned: { background: '#003a70', border: '2px solid #003a70', color: '#fff' },
  stickerDuplicate: { background: '#d97706', border: '2px solid #d97706', color: '#fff' },
  stickerCode: { fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', opacity: 0.85, lineHeight: 1 },
  stickerNum: { fontWeight: 700, fontSize: '14px', lineHeight: 1 },
  stickerBadge: { position: 'absolute', top: '-6px', right: '-6px', background: '#1a1a1a', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 5px', borderRadius: '8px', minWidth: '16px', textAlign: 'center' },
  empty: { color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px', margin: 0 },
  repeatsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  repeatsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
  stepper: { display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #d4cdc0', borderRadius: '8px', overflow: 'hidden' },
  stepBtn: { background: 'transparent', border: 'none', padding: '6px 12px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', color: '#003a70', minWidth: '32px' },
  stepCount: { padding: '0 10px', fontWeight: 700, fontSize: '14px', minWidth: '24px', textAlign: 'center', borderLeft: '1px solid #e5e1d8', borderRight: '1px solid #e5e1d8', fontFamily: 'monospace' },
  tradeBtn: { background: '#0a7a3f', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  dangerBtn: { background: '#fff', color: '#c5331a', border: '1px solid #c5331a', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  repeatRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f4f1ea', borderRadius: '8px' },
  repeatLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  repeatFlag: { fontSize: '24px' },
  repeatCode: { fontFamily: 'monospace', fontWeight: 700, fontSize: '14px' },
  repeatTeam: { fontSize: '12px', color: '#666', marginTop: '2px' },
  repeatRight: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e1d8' },
  statLabel: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '6px' },
  statValue: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', lineHeight: 1, color: '#003a70' },
  statFooter: { fontSize: '12px', color: '#888', marginTop: '4px' },
  progressList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  progressRow: { display: 'grid', gridTemplateColumns: '1fr 2fr auto', alignItems: 'center', gap: '12px', fontSize: '13px' },
  progressLabel: { display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  progressBarSm: { height: '8px', background: '#f4f1ea', borderRadius: '4px', overflow: 'hidden' },
  progressFillSm: { height: '100%', background: '#0055a4', transition: 'width 0.3s' },
  progressNum: { fontFamily: 'monospace', fontSize: '12px', color: '#666', minWidth: '40px', textAlign: 'right' },
  footer: { textAlign: 'center', padding: '20px', fontSize: '12px', color: '#888' },
};
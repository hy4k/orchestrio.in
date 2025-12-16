import React, { useState } from 'react';
import { Project, Secret, Bookmark, DeviceType } from '../types';
import { Icons } from './Icon';

interface WorkspaceProps {
  projects: Project[];
  secrets: Secret[];
  bookmarks: Bookmark[];
  onDeleteProject: (id: string) => void;
  onDeleteSecret: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  onEditSecret: (secret: Secret) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ projects, secrets, bookmarks, onDeleteProject, onDeleteSecret, onDeleteBookmark, onEditSecret }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'secrets' | 'bookmarks'>('projects');
  const [revealedSecrets, setRevealedSecrets] = useState<string[]>([]);

  const toggleSecret = (id: string) => {
    setRevealedSecrets(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-20 md:pb-0">
      <div className="mb-6 md:mb-8 flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide border-b border-[#ECEDE5]/10 pb-1">
        <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Icons.Box size={18} />}>Projects</TabButton>
        <TabButton active={activeTab === 'secrets'} onClick={() => setActiveTab('secrets')} icon={<Icons.Key size={18} />}>Secrets</TabButton>
        <TabButton active={activeTab === 'bookmarks'} onClick={() => setActiveTab('bookmarks')} icon={<Icons.Link size={18} />}>Bookmarks</TabButton>
      </div>

      {activeTab === 'projects' && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-3xl" style={{ boxShadow: '10px 10px 20px #352528, -10px -10px 20px #69494e' }}>
            <table className="w-full text-left border-collapse bg-[#4F373B]">
              <thead>
                <tr className="bg-[#3a292c] text-[#C16845] text-xs uppercase tracking-wider border-b border-[#ECEDE5]/10">
                  <th className="p-4 rounded-tl-3xl">Project</th>
                  <th className="p-4">Backend</th>
                  <th className="p-4">AI / Device</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Links</th>
                  <th className="p-4 rounded-tr-3xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#ECEDE5]/80">
                {projects.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-[#ECEDE5]/40 italic">No projects yet. Click + to add one.</td></tr>
                ) : (
                  projects.map(proj => (
                    <tr key={proj.id} className="border-b border-[#ECEDE5]/5 hover:bg-[#506467]/20 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-[#ECEDE5] text-base">{proj.name}</div>
                        <div className="text-[10px] text-[#ECEDE5]/40">{new Date(proj.lastUpdated).toLocaleDateString()}</div>
                        {proj.notes && (
                          <div className="mt-2 text-xs text-[#ECEDE5]/60 bg-[#3a292c]/50 p-2 rounded-lg border border-[#ECEDE5]/5 line-clamp-2 max-w-[200px]" title={proj.notes}>
                            {proj.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs truncate max-w-[150px]" title={proj.backendUrl || ''}>
                        {proj.backendUrl ? (
                           <a href={proj.backendUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#C16845]">
                             <Icons.Server size={12} /> {new URL(proj.backendUrl).hostname}
                           </a>
                        ) : <span className="opacity-30">-</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1 text-xs"><Icons.Sparkles size={10} className="text-[#BB7287]"/> {proj.aiPlatform}</span>
                          <span className="flex items-center gap-1 text-xs opacity-70">
                            {proj.device === DeviceType.MOBILE ? <Icons.Smartphone size={10} /> : 
                             proj.device === DeviceType.DESKTOP ? <Icons.Monitor size={10} /> : <Icons.Laptop size={10} />}
                            {proj.device === DeviceType.OTHER ? proj.otherDeviceName : proj.device}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                         <div className="flex flex-col gap-2">
                           <StatusBadge active={proj.isPushedToGit} label="Git Pushed" icon={<Icons.Github size={10} />} />
                           <StatusBadge active={proj.isDeployed} label="Deployed" icon={<Icons.Cloud size={10} />} />
                         </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {proj.repoUrl && (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-[#506467] hover:bg-[#C16845] transition-colors">
                              <Icons.Github size={14} />
                            </a>
                          )}
                          {proj.dockerInfo && (
                            <div className="p-2 rounded-full bg-[#506467] text-[#ECEDE5]/50 cursor-help" title={`Docker: ${proj.dockerInfo}`}>
                              <Icons.Box size={14} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                         <button onClick={() => onDeleteProject(proj.id)} className="p-2 text-[#ECEDE5]/30 hover:text-red-400 transition-colors">
                           <Icons.Trash2 size={16} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {projects.length === 0 ? (
               <div className="p-8 text-center text-[#ECEDE5]/40 italic bg-[#4F373B] rounded-3xl">No projects yet. Click + to add one.</div>
            ) : (
              projects.map(proj => (
                <div key={proj.id} className="bg-[#4F373B] p-5 rounded-[24px] flex flex-col gap-4 relative" style={{ boxShadow: '5px 5px 15px #352528, -5px -5px 15px #69494e' }}>
                   <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-[#ECEDE5]">{proj.name}</h3>
                        <span className="text-[10px] text-[#ECEDE5]/40">{new Date(proj.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => onDeleteProject(proj.id)} className="text-[#ECEDE5]/30 hover:text-red-400 p-1">
                         <Icons.Trash2 size={18} />
                      </button>
                   </div>
                   
                   {proj.notes && (
                      <div className="text-sm text-[#ECEDE5]/70 bg-[#3a292c]/50 p-3 rounded-xl border border-[#ECEDE5]/5 italic">
                        "{proj.notes}"
                      </div>
                   )}

                   <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-[#3a292c] p-2 rounded-xl">
                        <span className="text-[10px] text-[#C16845] font-bold uppercase block mb-1">Backend</span>
                        {proj.backendUrl ? (
                           <a href={proj.backendUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#C16845] truncate">
                             <Icons.Server size={12} /> {new URL(proj.backendUrl).hostname}
                           </a>
                        ) : <span className="opacity-30">-</span>}
                      </div>
                      <div className="bg-[#3a292c] p-2 rounded-xl">
                         <span className="text-[10px] text-[#C16845] font-bold uppercase block mb-1">AI / Device</span>
                         <div className="flex items-center gap-1 truncate">
                           <Icons.Sparkles size={10} className="text-[#BB7287]"/> {proj.aiPlatform}
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between border-t border-[#ECEDE5]/5 pt-3 mt-1">
                      <div className="flex gap-2">
                        <StatusBadge active={proj.isPushedToGit} label="Git" icon={<Icons.Github size={10} />} />
                        <StatusBadge active={proj.isDeployed} label="Live" icon={<Icons.Cloud size={10} />} />
                      </div>
                      <div className="flex gap-2">
                         {proj.repoUrl && (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#506467] hover:bg-[#C16845] transition-colors">
                              <Icons.Github size={14} />
                            </a>
                          )}
                          {proj.dockerInfo && (
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#506467] text-[#ECEDE5]/50" title={proj.dockerInfo}>
                              <Icons.Box size={14} />
                            </div>
                          )}
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'secrets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {secrets.length === 0 ? (
             <div className="col-span-full text-center p-12 text-[#ECEDE5]/40 bg-[#4F373B] rounded-3xl border border-[#ECEDE5]/5">No secrets saved. Securely store your API keys here.</div>
           ) : secrets.map(secret => (
             <div key={secret.id} className="bg-[#4F373B] p-6 rounded-3xl flex flex-col gap-4 relative group" style={{ boxShadow: '8px 8px 16px #3a292c, -8px -8px 16px #64454a' }}>
                <div className="flex justify-between items-start">
                   <div>
                     <span className="text-xs font-bold text-[#C16845] uppercase tracking-wider">{secret.service}</span>
                     <h3 className="font-bold text-lg text-[#ECEDE5]">{secret.name}</h3>
                   </div>
                   <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditSecret(secret)}
                        className="text-[#ECEDE5]/30 hover:text-[#C16845] p-1"
                        title="Edit Secret"
                      >
                         <Icons.Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteSecret(secret.id)} 
                        className="text-[#ECEDE5]/30 hover:text-red-400 p-1"
                        title="Delete Secret"
                      >
                         <Icons.Trash2 size={16} />
                      </button>
                   </div>
                </div>
                <div className="bg-[#3a292c] p-3 rounded-xl flex items-center justify-between font-mono text-sm border border-[#ECEDE5]/5">
                   <div className="truncate mr-4 text-[#ECEDE5]/80">
                     {revealedSecrets.includes(secret.id) ? secret.value : '•'.repeat(24)}
                   </div>
                   <div className="flex gap-2 shrink-0">
                      <button onClick={() => toggleSecret(secret.id)} className="text-[#ECEDE5]/50 hover:text-[#ECEDE5]">
                        {revealedSecrets.includes(secret.id) ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
                      </button>
                      <button onClick={() => copyToClipboard(secret.value)} className="text-[#ECEDE5]/50 hover:text-[#C16845]">
                        <Icons.Copy size={14} />
                      </button>
                   </div>
                </div>
                <div className="text-[10px] text-[#ECEDE5]/30 text-right">Added {new Date(secret.dateAdded).toLocaleDateString()}</div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {bookmarks.length === 0 ? (
             <div className="col-span-full text-center p-12 text-[#ECEDE5]/40 bg-[#4F373B] rounded-3xl border border-[#ECEDE5]/5">No bookmarks yet. Add links to tools, designs, and resources.</div>
           ) : bookmarks.map(bm => (
             <div key={bm.id} className="bg-[#4F373B] p-6 rounded-3xl flex flex-col h-full relative group transition-transform hover:-translate-y-1" style={{ boxShadow: '8px 8px 16px #3a292c, -8px -8px 16px #64454a' }}>
                <div className="flex justify-between items-start mb-2">
                   <span className="bg-[#506467] text-[#ECEDE5] text-[10px] font-bold px-2 py-1 rounded-md">{bm.category}</span>
                   <button onClick={() => onDeleteBookmark(bm.id)} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-[#ECEDE5]/30 hover:text-red-400 transition-opacity">
                     <Icons.Trash2 size={14} />
                   </button>
                </div>
                <h3 className="font-bold text-lg text-[#ECEDE5] mb-1 line-clamp-1" title={bm.title}>{bm.title}</h3>
                <a href={bm.url} target="_blank" rel="noreferrer" className="text-xs text-[#C16845] hover:underline mb-4 truncate block flex items-center gap-1">
                   <Icons.ExternalLink size={10} /> {bm.url}
                </a>
                {bm.note && <p className="text-sm text-[#ECEDE5]/60 mb-4 line-clamp-3">{bm.note}</p>}
                <div className="mt-auto pt-4 border-t border-[#ECEDE5]/5 text-[10px] text-[#ECEDE5]/30">
                  {new Date(bm.dateAdded).toLocaleDateString()}
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, children }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-t-2xl font-bold transition-all whitespace-nowrap ${
      active ? 'bg-[#4F373B] text-[#C16845]' : 'text-[#ECEDE5]/50 hover:bg-[#4F373B]/50 hover:text-[#ECEDE5]'
    }`}
  >
    {icon} {children}
  </button>
);

const StatusBadge = ({ active, label, icon }: any) => (
  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold w-fit ${active ? 'bg-[#506467] text-[#98c379]' : 'bg-[#3a292c] text-[#ECEDE5]/30'}`}>
    {icon}
    {label}
  </div>
);

export default Workspace;
import React, { useState, useMemo, useEffect } from 'react';
import { Category, Prompt, Platform, Project, Secret, Bookmark } from './types';
import { PROMPT_DATA } from './data';
import PromptCard from './components/PromptCard';
import PromptModal from './components/PromptModal';
import CreatePromptModal from './components/CreatePromptModal';
import { CreateProjectModal, CreateSecretModal, CreateBookmarkModal } from './components/ResourceModals';
import Workspace from './components/Workspace';
import Guide from './components/Guide';
import { Icons } from './components/Icon';
import Builder from './components/Builder';
import { GlowingButton } from './components/Button';
import ChatBot from './components/ChatBot';
import Auth from './components/Auth';
import Logo from './components/Logo';
import { Tutorial, TutorialStep } from './components/Tutorial';
import { supabase } from './utils/supabaseClient';

const App: React.FC = () => {
  // State
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'bank' | 'builder' | 'guide' | 'workspace'>('bank');
  const [activeFilter, setActiveFilter] = useState<Category | Platform | 'All' | 'Saved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  // Resources State
  const [prompts, setPrompts] = useState<Prompt[]>(PROMPT_DATA); // Start with static data, then fetch
  const [projects, setProjects] = useState<Project[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [savedPromptIds, setSavedPromptIds] = useState<string[]>([]);

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      // Reset to initial state or kept public data if any
      setProjects([]);
      setSecrets([]);
      setBookmarks([]);
      setSavedPromptIds([]);
      // setPrompts(PROMPT_DATA); // Keep public prompts visible or not? Assuming user wants to see their data.
      // For now let's keep PROMPT_DATA mixed with User Data or just User Data? 
      // The prompt implies "all the featuresd in it", let's assume we fetch everything.
    }
  }, [session]);

  const fetchData = async () => {
    if (!session?.user) return;

    // Fetch Prompts
    const { data: promptsData, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (promptsData) {
      // Merge with static data or replace? Let's assume we want to show both or just DB. 
      // For a full app, usually just DB. But PROMPT_DATA might be "system" prompts.
      // Let's prepend DB prompts to PROMPT_DATA or just use DB.
      // If we want "Bank" feel, maybe we import PROMPT_DATA into DB once.
      // For now, let's mix them.
      setPrompts([...promptsData, ...PROMPT_DATA]);
    }

    // Fetch Projects
    const { data: projectsData } = await supabase.from('projects').select('*').order('last_updated', { ascending: false });
    if (projectsData) setProjects(projectsData);

    // Fetch Secrets
    const { data: secretsData } = await supabase.from('secrets').select('*').order('date_added', { ascending: false });
    if (secretsData) setSecrets(secretsData);

    // Fetch Bookmarks
    const { data: bookmarksData } = await supabase.from('bookmarks').select('*').order('date_added', { ascending: false });
    if (bookmarksData) setBookmarks(bookmarksData);

    // Fetch Saved Prompts
    const { data: savedData } = await supabase.from('saved_prompts').select('prompt_id');
    if (savedData) setSavedPromptIds(savedData.map(item => item.prompt_id));
  };

  const handleLogin = (sessionData: any) => {
    // Session is handled by useEffect onAuthStateChange, but we can set it here too to be snappy
    setSession(sessionData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setSecrets([]);
    setProjects([]);
    setBookmarks([]);
    setActiveTab('bank');
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('orchestrio_tutorial_seen', 'true');
    // Return to bank at end
    setActiveTab('bank');
  };

  // Resource Handlers
  const handleCreateProject = async (project: Omit<Project, 'id'>) => {
    if (!session?.user) return;

    const { data, error } = await supabase.from('projects').insert([
      { ...project, user_id: session.user.id }
    ]).select().single();

    if (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
      return;
    }

    if (data) {
      setProjects([data, ...projects]);
      setActiveTab('workspace');
    }
  };

  const handleSaveSecret = async (secretData: Omit<Secret, 'id'>) => {
    if (!session?.user) return;
    if (selectedSecret) {
      // Edit Mode
      const { data, error } = await supabase
        .from('secrets')
        .update({ ...secretData })
        .eq('id', selectedSecret.id)
        .select()
        .single();

      if (!error && data) {
        setSecrets(secrets.map(s => s.id === selectedSecret.id ? data : s));
      }
    } else {
      // Create Mode
      const { data, error } = await supabase.from('secrets').insert([
        { ...secretData, user_id: session.user.id }
      ]).select().single();

      if (!error && data) {
        setSecrets([data, ...secrets]);
      }
    }

    setActiveTab('workspace');
    setIsSecretModalOpen(false);
    setSelectedSecret(null);
  };

  const handleEditSecretClick = (secret: Secret) => {
    setSelectedSecret(secret);
    setIsSecretModalOpen(true);
  };

  const deleteResource = async (type: 'project' | 'secret' | 'bookmark', id: string) => {
    const table = type === 'project' ? 'projects' : type === 'secret' ? 'secrets' : 'bookmarks';

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(`Error deleting ${type}`, error);
      return;
    }

    if (type === 'project') {
      setProjects(projects.filter(p => p.id !== id));
    } else if (type === 'secret') {
      setSecrets(secrets.filter(s => s.id !== id));
    } else {
      setBookmarks(bookmarks.filter(b => b.id !== id));
    }
  };

  const handleCreateBookmark = async (bookmark: Omit<Bookmark, 'id'>) => {
    if (!session?.user) return;

    const { data, error } = await supabase.from('bookmarks').insert([
      { ...bookmark, user_id: session.user.id }
    ]).select().single();

    if (!error && data) {
      setBookmarks([data, ...bookmarks]);
      setActiveTab('workspace');
    }
  };

  const toggleSavePrompt = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!session?.user) return;

    if (savedPromptIds.includes(id)) {
      // Unsave
      const { error } = await supabase.from('saved_prompts').delete().eq('prompt_id', id).eq('user_id', session.user.id);
      if (!error) {
        setSavedPromptIds(prev => prev.filter(pId => pId !== id));
      }
    } else {
      // Save
      const { error } = await supabase.from('saved_prompts').insert([{ prompt_id: id, user_id: session.user.id }]);
      if (!error) {
        setSavedPromptIds(prev => [...prev, id]);
      }
    }
  };

  const handleEditPromptClick = (e: React.MouseEvent, prompt: Prompt) => {
    e.stopPropagation();
    setSelectedPrompt(prompt);
    setIsEditingModal(true);
  };

  const handleCardClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsEditingModal(false);
  };

  const handleSavePromptData = async (updatedPrompt: Prompt) => {
    // Check if it is a user-owned prompt (UUID) or system prompt (string/number ID usually, but here all are strings)
    // For simplicity, we only allow editing User Prompts that exist in DB. 
    // PROMPT_DATA items effectively can't be edited persistently unless we clone them.
    // Let's assume we update if it exists in DB.

    if (updatedPrompt.id && session?.user) {
      const { data, error } = await supabase
        .from('prompts')
        .update({
          title: updatedPrompt.title,
          description: updatedPrompt.description,
          content: updatedPrompt.content,
          category: updatedPrompt.category,
          tags: updatedPrompt.tags,
          rtcros: updatedPrompt.rtcros,
          parameters: updatedPrompt.parameters,
        })
        .eq('id', updatedPrompt.id)
        .select()
        .single();

      if (!error && data) {
        setPrompts(prompts.map(p => p.id === updatedPrompt.id ? data : p));
      } else {
        console.error("Failed to update prompt", error);
      }
    }

    setSelectedPrompt(updatedPrompt);
    setIsEditingModal(false);
  };

  const handleCreatePrompt = async (newPromptData: Omit<Prompt, 'id' | 'likes'>) => {
    if (!session?.user) return;

    const { data, error } = await supabase.from('prompts').insert([
      { ...newPromptData, user_id: session.user.id }
    ]).select().single();

    if (!error && data) {
      setPrompts([data, ...prompts]);
    }
  };

  // Filter Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      let matchesFilter = false;

      if (activeFilter === 'All') {
        matchesFilter = true;
      } else if (activeFilter === 'Saved') {
        matchesFilter = savedPromptIds.includes(prompt.id);
      } else if (Object.values(Category).includes(activeFilter as Category)) {
        matchesFilter = prompt.category === activeFilter;
      } else if (Object.values(Platform).includes(activeFilter as Platform)) {
        matchesFilter = prompt.tags.includes(activeFilter as Platform);
      }

      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, savedPromptIds, prompts]);

  const FABItem = ({ onClick, icon, label, color }: any) => (
    <div className="flex items-center gap-4 mb-3 mr-1 transition-all origin-right hover:scale-105">
      <span className="bg-[#4F373B] text-[#ECEDE5] text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">{label}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); setFabOpen(false); }}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white ${color}`}
      >
        {icon}
      </button>
    </div>
  );

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Orchestrio",
      description: "Your comprehensive AI prompt bank and engineering workspace. Let's take a quick tour to show you around.",
      onEnter: () => setActiveTab('bank')
    },
    {
      targetId: "nav-bank",
      title: "The Prompt Bank",
      description: "Browse high-quality, pre-engineered prompts for coding, writing, and creative arts. Click any prompt to copy, edit, or analyze its structure.",
      onEnter: () => setActiveTab('bank')
    },
    {
      targetId: "nav-builder",
      title: "Prompt Architect",
      description: "Use the 'Builder' tab to craft structurally perfect prompts using the RTCROS (Role, Task, Context, Restrictions, Output, Style) framework.",
      onEnter: () => setActiveTab('builder')
    },
    {
      targetId: "nav-workspace",
      title: "Secure Workspace",
      description: "Manage your projects, save bookmarks, and securely store API keys using client-side encryption.",
      onEnter: () => setActiveTab('workspace')
    },
    {
      targetId: "nav-guide",
      title: "Engineering Guide",
      description: "New to prompt engineering? This guide breaks down the core principles to help you get better results from AI.",
      onEnter: () => setActiveTab('guide')
    },
    {
      targetId: "fab-main",
      title: "Quick Actions",
      description: "Use this button from anywhere to quickly add new prompts, projects, secrets, or bookmarks.",
      onEnter: () => setActiveTab('bank')
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-[#506467] flex items-center justify-center text-[#ECEDE5]">Loading...</div>;
  }

  if (!session) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#506467] text-[#ECEDE5] flex flex-col font-sans overflow-x-hidden selection:bg-[#C16845] selection:text-white relative">

      {/* Tutorial Overlay */}
      <Tutorial
        isActive={showTutorial}
        steps={tutorialSteps}
        onComplete={completeTutorial}
        onSkip={completeTutorial}
      />

      {/* AI Chat Bot */}
      <ChatBot />

      {/* Speed Dial FAB */}
      <div id="fab-main" className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
        {fabOpen && (
          <div className="mb-2 pl-2">
            <FABItem onClick={() => setIsBookmarkModalOpen(true)} icon={<Icons.Link size={20} />} label="Add Bookmark" color="bg-[#BB7287]" />
            <FABItem onClick={() => { setIsSecretModalOpen(true); setSelectedSecret(null); }} icon={<Icons.Key size={20} />} label="Add Key/Secret" color="bg-[#eab308]" />
            <FABItem onClick={() => setIsProjectModalOpen(true)} icon={<Icons.Box size={20} />} label="Add Project" color="bg-[#3b82f6]" />
            <FABItem onClick={() => setIsCreateModalOpen(true)} icon={<Icons.Sparkles size={20} />} label="Add Prompt" color="bg-[#C16845]" />
          </div>
        )}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          style={{
            background: '#C16845',
            boxShadow: '10px 10px 20px rgba(0,0,0,0.4), -10px -10px 20px rgba(255,255,255,0.05)',
            transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)'
          }}
          title="Add New..."
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <Icons.Plus size={24} className="text-white" />
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full py-4 px-4 md:px-0">
        <div className="container mx-auto">
          <div
            className="h-20 rounded-[24px] px-6 flex items-center justify-between"
            style={{
              background: '#506467',
              boxShadow: '10px 10px 20px #3d4c4e, -10px -10px 20px #637c80'
            }}
          >
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('bank')}>
              <Logo className="w-10 h-10" variant="icon" />
              <span className="text-2xl font-bold text-[#ECEDE5] tracking-tight hidden sm:block">
                orchestrio.in
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                id="nav-bank"
                onClick={() => setActiveTab('bank')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'bank' ? 'text-[#C16845]' : 'text-[#ECEDE5]/50 hover:text-[#ECEDE5]'}`}
              >
                Bank
              </button>
              <button
                id="nav-builder"
                onClick={() => setActiveTab('builder')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'builder' ? 'text-[#BB7287]' : 'text-[#ECEDE5]/50 hover:text-[#ECEDE5]'}`}
              >
                Builder
              </button>
              <button
                id="nav-workspace"
                onClick={() => setActiveTab('workspace')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'workspace' ? 'text-[#3b82f6]' : 'text-[#ECEDE5]/50 hover:text-[#ECEDE5]'}`}
              >
                Workspace
              </button>
              <button
                id="nav-guide"
                onClick={() => setActiveTab('guide')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'guide' ? 'text-[#eab308]' : 'text-[#ECEDE5]/50 hover:text-[#ECEDE5]'}`}
              >
                Guide
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="hidden md:flex items-center px-4 py-2 rounded-full w-64 transition-all focus-within:w-80"
                style={{
                  background: '#506467',
                  boxShadow: 'inset 5px 5px 10px #3d4c4e, inset -5px -5px 10px #637c80'
                }}
              >
                <Icons.Search size={18} className="text-[#ECEDE5]/50 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-[#ECEDE5] text-sm w-full placeholder-[#ECEDE5]/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full text-[#ECEDE5]/50 hover:text-[#C16845] transition-colors"
                title="Logout (Locks Vault)"
              >
                <Icons.User size={20} />
              </button>

              <button
                className="md:hidden w-12 h-12 flex items-center justify-center rounded-full text-[#ECEDE5] active:scale-95 transition-transform"
                style={{
                  background: '#506467',
                  boxShadow: '5px 5px 10px #3d4c4e, -5px -5px 10px #637c80'
                }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Icons.Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#506467]/95 backdrop-blur-xl md:hidden flex flex-col p-6 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4F373B] text-[#ECEDE5]"
              >
                <Icons.X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
              <button
                onClick={() => { setActiveTab('bank'); setMobileMenuOpen(false); }}
                className={`py-5 rounded-2xl text-xl font-bold tracking-widest uppercase transition-all ${activeTab === 'bank' ? 'bg-[#C16845] text-white shadow-lg scale-105' : 'bg-[#4F373B] text-[#ECEDE5]/50'}`}
              >
                Bank
              </button>
              <button
                onClick={() => { setActiveTab('builder'); setMobileMenuOpen(false); }}
                className={`py-5 rounded-2xl text-xl font-bold tracking-widest uppercase transition-all ${activeTab === 'builder' ? 'bg-[#BB7287] text-white shadow-lg scale-105' : 'bg-[#4F373B] text-[#ECEDE5]/50'}`}
              >
                Builder
              </button>
              <button
                onClick={() => { setActiveTab('workspace'); setMobileMenuOpen(false); }}
                className={`py-5 rounded-2xl text-xl font-bold tracking-widest uppercase transition-all ${activeTab === 'workspace' ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'bg-[#4F373B] text-[#ECEDE5]/50'}`}
              >
                Workspace
              </button>
              <button
                onClick={() => { setActiveTab('guide'); setMobileMenuOpen(false); }}
                className={`py-5 rounded-2xl text-xl font-bold tracking-widest uppercase transition-all ${activeTab === 'guide' ? 'bg-[#eab308] text-white shadow-lg scale-105' : 'bg-[#4F373B] text-[#ECEDE5]/50'}`}
              >
                Guide
              </button>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full py-4 rounded-2xl font-bold text-center bg-[#3a292c] text-[#ECEDE5] flex items-center justify-center gap-2"
              >
                <Icons.User size={20} />
                Logout (Lock Vault)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-4 md:py-8 mb-20 md:mb-0">
        {activeTab === 'bank' ? (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
            <aside className="w-full lg:w-72 flex-shrink-0">
              {/* Mobile Search - Visible only on mobile bank tab */}
              <div
                className="md:hidden flex items-center px-4 py-3 rounded-xl w-full mb-6"
                style={{
                  background: '#506467',
                  boxShadow: 'inset 5px 5px 10px #3d4c4e, inset -5px -5px 10px #637c80'
                }}
              >
                <Icons.Search size={18} className="text-[#ECEDE5]/50 mr-2" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  className="bg-transparent border-none focus:outline-none text-[#ECEDE5] text-base w-full placeholder-[#ECEDE5]/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-[#ECEDE5]/50 font-display font-bold uppercase tracking-widest text-xs mb-3 md:mb-4 ml-2">Collections</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                    <div onClick={() => setActiveFilter('All')}>
                      <GlowingButton isActive={activeFilter === 'All'} className="w-full py-3 md:py-4">All Prompts</GlowingButton>
                    </div>
                    <div onClick={() => setActiveFilter('Saved')}>
                      <GlowingButton isActive={activeFilter === 'Saved'} className="w-full py-3 md:py-4">Saved</GlowingButton>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <h3 className="text-[#ECEDE5]/50 font-display font-bold uppercase tracking-widest text-xs mb-4 ml-2">Categories</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {Object.values(Category).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 group ${activeFilter === cat
                          ? 'bg-[#4F373B] text-[#C16845] shadow-[8px_8px_16px_#352528,-8px_-8px_16px_#69494e]'
                          : 'text-[#ECEDE5]/60 hover:text-[#ECEDE5] hover:bg-[#4F373B] hover:shadow-[4px_4px_8px_#352528,-4px_-4px_8px_#69494e]'
                          }`}
                      >
                        <span className={`transition-colors ${activeFilter === cat ? "text-[#C16845]" : "text-[#ECEDE5]/40 group-hover:text-[#C16845]"}`}>
                          {getCategoryIcon(cat)}
                        </span>
                        <span className="font-display font-bold uppercase tracking-widest text-xs leading-relaxed">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Horizontal Categories */}
                <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-3 px-1">
                    {Object.values(Category).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${activeFilter === cat
                          ? 'bg-[#4F373B] border-[#C16845] text-[#C16845]'
                          : 'bg-transparent border-[#ECEDE5]/10 text-[#ECEDE5]/50'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[#ECEDE5]/50 font-display font-bold uppercase tracking-widest text-xs mb-4 ml-2">Models</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Platform).map(platform => (
                      <button
                        key={platform}
                        onClick={() => setActiveFilter(platform)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeFilter === platform
                          ? 'bg-[#BB7287] text-white shadow-lg transform scale-105'
                          : 'bg-[#4F373B] text-[#ECEDE5]/60 hover:text-[#ECEDE5] hover:shadow-md'
                          }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#ECEDE5] mb-2 font-display uppercase tracking-tight">
                    {activeFilter === 'All' ? 'Explore' : activeFilter}
                  </h2>
                  <p className="text-[#ECEDE5]/50 text-sm">
                    Showing {filteredPrompts.length} high-performance prompts
                  </p>
                </div>
              </div>

              {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-10">
                  {filteredPrompts.map(prompt => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onClick={() => handleCardClick(prompt)}
                      isSaved={savedPromptIds.includes(prompt.id)}
                      onToggleSave={toggleSavePrompt}
                      onEdit={handleEditPromptClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Icons.Search size={64} className="mb-4 text-[#4F373B]" />
                  <p className="text-[#ECEDE5]/50 text-xl font-light">No prompts found.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'builder' ? (
          <Builder />
        ) : activeTab === 'guide' ? (
          <Guide />
        ) : (
          <Workspace
            projects={projects}
            secrets={secrets}
            bookmarks={bookmarks}
            onDeleteProject={(id) => deleteResource('project', id)}
            onDeleteSecret={(id) => deleteResource('secret', id)}
            onDeleteBookmark={(id) => deleteResource('bookmark', id)}
            onEditSecret={handleEditSecretClick}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-[#ECEDE5]/30 text-sm font-display uppercase tracking-widest hidden md:block">
        <p>orchestrio.in &copy; {new Date().getFullYear()}</p>
      </footer>

      {/* Modals */}
      <PromptModal
        prompt={selectedPrompt}
        isOpen={!!selectedPrompt}
        isEditing={isEditingModal}
        onToggleEdit={() => setIsEditingModal(!isEditingModal)}
        onClose={() => { setSelectedPrompt(null); setIsEditingModal(false); }}
        onSave={handleSavePromptData}
      />

      <CreatePromptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePrompt}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <CreateSecretModal
        isOpen={isSecretModalOpen}
        onClose={() => { setIsSecretModalOpen(false); setSelectedSecret(null); }}
        onSave={handleSaveSecret}
        initialData={selectedSecret}
      />

      <CreateBookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onCreate={handleCreateBookmark}
      />
    </div>
  );
};

const getCategoryIcon = (cat: Category) => {
  switch (cat) {
    case Category.CODING: return <Icons.Code size={16} />;
    case Category.IMAGE: return <Icons.Image size={16} />;
    case Category.VIDEO: return <Icons.Video size={16} />;
    case Category.STUDIES: return <Icons.BookOpen size={16} />;
    case Category.WRITING: return <Icons.PenTool size={16} />;
    case Category.MARKETING: return <Icons.Zap size={16} />;
    case Category.PRODUCTIVITY: return <Icons.Briefcase size={16} />;
    default: return <Icons.Layers size={16} />;
  }
};

export default App;
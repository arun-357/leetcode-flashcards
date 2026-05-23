import { useState, useMemo } from 'react';
import { Collapse } from '@chakra-ui/react';
import {
  FaAmazon, FaMicrosoft, FaFacebook, FaGoogle, FaNewspaper, FaApple, FaCodeBranch,
} from 'react-icons/fa';
import FlashCardGame from './components/FlashCardGame.jsx';
import LLDProjects from './components/LLDProjects.jsx';
import loadLldProjects from './data/lldLoader.js';
import staticLlds from './data/llds.js';
import companyData from './data/companies.json';
import patternQuestions from './data/patterns.json';

const COMPANY_ICONS = { Amazon: FaAmazon, Microsoft: FaMicrosoft, Meta: FaFacebook, Google: FaGoogle, Bloomberg: FaNewspaper, Apple: FaApple };

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryType, setCategoryType]         = useState(null);
  const [searchQuery, setSearchQuery]           = useState('');
  const [companiesOpen, setCompaniesOpen]       = useState(false);
  const [patternsOpen, setPatternsOpen]         = useState(false);

  const lldProjects = useMemo(() => {
    const loaded = loadLldProjects();
    return Object.keys(loaded).length ? loaded : staticLlds;
  }, []);

  // Both data sources are static JSON imports — memoize once with empty deps.
  const companies = useMemo(() => [
    { name: 'Amazon',    icon: FaAmazon,    questions: companyData.Amazon    || [] },
    { name: 'Microsoft', icon: FaMicrosoft, questions: companyData.Microsoft || [] },
    { name: 'Meta',      icon: FaFacebook,  questions: companyData.Meta      || [] },
    { name: 'Google',    icon: FaGoogle,    questions: companyData.Google    || [] },
    { name: 'Bloomberg', icon: FaNewspaper, questions: companyData.Bloomberg || [] },
    { name: 'Apple',     icon: FaApple,     questions: companyData.Apple     || [] },
  ], []);

  const patterns = useMemo(() => Object.keys(patternQuestions).map(p => ({
    name: p,
    icon: FaCodeBranch,
    questions: patternQuestions[p],
  })), []);

  const allQuestions = useMemo(() => {
    const map = new Map();
    patterns.forEach(p => p.questions.forEach(q => {
      map.set(q.title, { ...q, source: p.name, sourceType: 'pattern' });
    }));
    Object.keys(companyData).forEach(co => companyData[co].forEach(q => {
      if (!map.has(q.title)) map.set(q.title, { ...q, source: co, sourceType: 'company' });
    }));
    return Array.from(map.values());
  }, [patterns]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const re = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return allQuestions.filter(q => re.test(q.title) || re.test(q.description) || re.test(q.category));
  }, [searchQuery, allQuestions]);

  function handleSelect(name, type) {
    setSelectedCategory(name);
    setCategoryType(type);
    setSearchQuery('');
  }
  function handleSearchSelect(question) {
    setSelectedCategory(question);
    setCategoryType('search');
  }
  function handleBack() {
    setSelectedCategory(null);
    setCategoryType(null);
  }

  // FlashCardGame and LLDProjects get the full viewport — render outside any wrapper.
  if (selectedCategory && categoryType !== 'lld') {
    return (
      <FlashCardGame
        company={categoryType === 'company' ? selectedCategory : undefined}
        pattern={categoryType === 'pattern' ? selectedCategory : undefined}
        categoryType={categoryType}
        questions={
          categoryType === 'search'
            ? [selectedCategory]
            : categoryType === 'company'
              ? companies.find(c => c.name === selectedCategory).questions
              : patterns.find(p => p.name === selectedCategory).questions
        }
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="ld-nav-shell">
      {/* Terminal header */}
      <header className="ld-hdr">
        <div className="ld-hdr-logo">
          <span className="prompt">&gt;</span>leetdeck
        </div>
        <div className="ld-hdr-path">
          <span className="seg">~/decks</span>
          <span className="sep">/</span>
          <span className="seg">{categoryType === 'lld' ? 'lld' : 'home'}</span>
        </div>
        <div className="ld-hdr-spacer" />
      </header>

      {/* LLD full content */}
      {categoryType === 'lld' ? (
        <div style={{ padding: '24px 24px 100px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <LLDProjects
            projects={lldProjects}
            onBack={handleBack}
          />
        </div>
      ) : (
        <div className="ld-nav-content">
          {/* Companies */}
          <div className="ld-cat-section">
            <button className="ld-cat-toggle" onClick={() => setCompaniesOpen(o => !o)}>
              <span>Companies</span>
              <span className={`toggle-chevron${companiesOpen ? ' open' : ''}`}>▾</span>
            </button>
            <Collapse in={companiesOpen} animateOpacity>
              <div className="ld-cat-grid" style={{ paddingTop: 4 }}>
                {companies.map(c => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.name}
                      className="ld-cat-item"
                      onClick={() => handleSelect(c.name, 'company')}
                    >
                      <span className="cat-icon"><Icon /></span>
                      <div className="cat-name">{c.name}</div>
                      <div className="cat-count">{c.questions.length} questions</div>
                    </button>
                  );
                })}
              </div>
            </Collapse>
          </div>

          {/* Patterns */}
          <div className="ld-cat-section">
            <button className="ld-cat-toggle" onClick={() => setPatternsOpen(o => !o)}>
              <span>Patterns</span>
              <span className={`toggle-chevron${patternsOpen ? ' open' : ''}`}>▾</span>
            </button>
            <Collapse in={patternsOpen} animateOpacity>
              <div className="ld-cat-grid" style={{ paddingTop: 4 }}>
                {patterns.map(p => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.name}
                      className="ld-cat-item"
                      onClick={() => handleSelect(p.name, 'pattern')}
                    >
                      <span className="cat-icon"><Icon /></span>
                      <div className="cat-name">{p.name}</div>
                      <div className="cat-count">{p.questions.length} questions</div>
                    </button>
                  );
                })}
              </div>
            </Collapse>
          </div>

          {/* LLD */}
          <button
            className="ld-lld-btn"
            onClick={() => { setSelectedCategory('LLD'); setCategoryType('lld'); }}
          >
            <span>Low Level Designs (LLD)</span>
            <span className="lld-arrow">→</span>
          </button>

          {/* Search */}
          <div className="ld-nav-search">
            <div className="ld-nav-search-input-row">
              <span className="pre">&gt;</span>
              <input
                placeholder="search questions by title, category, description…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search questions"
              />
            </div>
            {searchQuery && (
              <div className="ld-nav-search-results">
                {searchResults.length === 0 ? (
                  <div className="ld-no-results">No results for "{searchQuery}"</div>
                ) : (
                  searchResults.map((r, i) => (
                    <div
                      key={`${r.source}-${r.title}-${i}`}
                      className="ld-nav-search-result"
                      onClick={() => handleSearchSelect(r)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && handleSearchSelect(r)}
                    >
                      <span className="nsr-title">{r.title}</span>
                      <span className="nsr-meta">{r.category}</span>
                      <span className="nsr-meta" style={{ color: 'var(--fg-4)' }}>
                        {r.sourceType === 'company' ? r.source : r.source}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

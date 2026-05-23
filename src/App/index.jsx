import { useState, useMemo } from 'react';
import { Collapse } from '@chakra-ui/react';
import {
  FaAmazon, FaMicrosoft, FaFacebook, FaGoogle, FaNewspaper, FaApple, FaCodeBranch,
} from 'react-icons/fa';
import FlashCardGame from '../components/FlashCardGame/index.jsx';
import LLDProjects from '../components/LLDProjects.jsx';
import loadLldProjects from '../data/lldLoader.js';
import staticLlds from '../data/llds.js';
import companyData from '../data/companies.json';
import patternQuestions from '../data/patterns.json';
import { Header, HeaderLogo, HeaderPath, HeaderSpacer } from '../styles/shared.styles.js';
import {
  NavShell, NavContent, LldContainer,
  CatSection, CatToggle, ToggleChevron, CatGrid, CatItem,
  LldBtn,
  NavSearch, NavSearchInputRow, NavSearchResults,
  NavSearchResult, NavSearchResultMeta, NoResults,
} from './styles.js';

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
    <NavShell>
      {/* Terminal header */}
      <Header>
        <HeaderLogo>
          <span className="prompt">&gt;</span>leetdeck
        </HeaderLogo>
        <HeaderPath>
          <span className="seg">~/decks</span>
          <span className="sep">/</span>
          <span className="seg">{categoryType === 'lld' ? 'lld' : 'home'}</span>
        </HeaderPath>
        <HeaderSpacer />
      </Header>

      {/* LLD full content */}
      {categoryType === 'lld' ? (
        <LldContainer>
          <LLDProjects
            projects={lldProjects}
            onBack={handleBack}
          />
        </LldContainer>
      ) : (
        <NavContent>
          {/* Companies */}
          <CatSection>
            <CatToggle onClick={() => setCompaniesOpen(o => !o)}>
              <span>Companies</span>
              <ToggleChevron $open={companiesOpen}>▾</ToggleChevron>
            </CatToggle>
            <Collapse in={companiesOpen} animateOpacity>
              <CatGrid>
                {companies.map(c => {
                  const Icon = c.icon;
                  return (
                    <CatItem
                      key={c.name}
                      onClick={() => handleSelect(c.name, 'company')}
                    >
                      <span className="cat-icon"><Icon /></span>
                      <div className="cat-name">{c.name}</div>
                      <div className="cat-count">{c.questions.length} questions</div>
                    </CatItem>
                  );
                })}
              </CatGrid>
            </Collapse>
          </CatSection>

          {/* Patterns */}
          <CatSection>
            <CatToggle onClick={() => setPatternsOpen(o => !o)}>
              <span>Patterns</span>
              <ToggleChevron $open={patternsOpen}>▾</ToggleChevron>
            </CatToggle>
            <Collapse in={patternsOpen} animateOpacity>
              <CatGrid>
                {patterns.map(p => {
                  const Icon = p.icon;
                  return (
                    <CatItem
                      key={p.name}
                      onClick={() => handleSelect(p.name, 'pattern')}
                    >
                      <span className="cat-icon"><Icon /></span>
                      <div className="cat-name">{p.name}</div>
                      <div className="cat-count">{p.questions.length} questions</div>
                    </CatItem>
                  );
                })}
              </CatGrid>
            </Collapse>
          </CatSection>

          {/* LLD */}
          <LldBtn
            onClick={() => { setSelectedCategory('LLD'); setCategoryType('lld'); }}
          >
            <span>Low Level Designs (LLD)</span>
            <span className="lld-arrow">→</span>
          </LldBtn>

          {/* Search */}
          <NavSearch>
            <NavSearchInputRow>
              <span className="pre">&gt;</span>
              <input
                placeholder="search questions by title, category, description…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search questions"
              />
            </NavSearchInputRow>
            {searchQuery && (
              <NavSearchResults>
                {searchResults.length === 0 ? (
                  <NoResults>No results for "{searchQuery}"</NoResults>
                ) : (
                  searchResults.map((r, i) => (
                    <NavSearchResult
                      key={`${r.source}-${r.title}-${i}`}
                      onClick={() => handleSearchSelect(r)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && handleSearchSelect(r)}
                    >
                      <span className="nsr-title">{r.title}</span>
                      <NavSearchResultMeta>{r.category}</NavSearchResultMeta>
                      <NavSearchResultMeta $dim>
                        {r.source}
                      </NavSearchResultMeta>
                    </NavSearchResult>
                  ))
                )}
              </NavSearchResults>
            )}
          </NavSearch>
        </NavContent>
      )}
    </NavShell>
  );
};

export default App;

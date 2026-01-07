import React from 'react';
import Link from 'next/link';
import { LINKING_ARCHITECTURE, getLinkingRelationships, selectAnchorText, LinkingNode } from '../../config/internal-linking';

interface InternalLinkProps {
  to: string;
  from: string;
  context: 'upward' | 'downward' | 'sideways' | 'conversion';
  className?: string;
  children?: React.ReactNode;
}

// Strategic internal link component with automatic anchor text selection
export function InternalLink({ to, from, context, className = '', children }: InternalLinkProps) {
  const targetNode = LINKING_ARCHITECTURE[to];
  if (!targetNode) return <span className="text-red-500">Invalid link target: {to}</span>;

  const anchorText = children || selectAnchorText(from, to, context);
  
  return (
    <Link 
      href={targetNode.url}
      className={`${className} transition-colors hover:text-[#FF8A3D]`}
      title={`${targetNode.name} - ${targetNode.metadata.description}`}
    >
      {anchorText}
    </Link>
  );
}

interface LinkingSectionProps {
  currentNodeId: string;
  title: string;
  context: 'upward' | 'downward' | 'sideways' | 'conversion';
  maxLinks?: number;
  className?: string;
  gridCols?: 1 | 2 | 3 | 4;
}

// Strategic linking section that generates contextual link groups
export function LinkingSection({ 
  currentNodeId, 
  title, 
  context, 
  maxLinks = 6, 
  className = '',
  gridCols = 3 
}: LinkingSectionProps) {
  const relationships = getLinkingRelationships(currentNodeId);
  const targetIds = relationships[context] || [];
  
  // Sort by priority and limit results
  const sortedTargets = targetIds
    .map(id => LINKING_ARCHITECTURE[id])
    .filter(Boolean)
    .sort((a, b) => b.metadata.priority - a.metadata.priority)
    .slice(0, maxLinks);

  if (sortedTargets.length === 0) return null;

  const gridClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[gridCols];

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          <span className="text-white">{title}</span>
        </h2>
        <div className={`grid gap-6 ${gridClass}`}>
          {sortedTargets.map((target) => (
            <InternalLink
              key={target.id}
              from={currentNodeId}
              to={target.id}
              context={context}
              className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:border-[#FF8A3D] transition-all block"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A3D] transition-colors">
                  {selectAnchorText(currentNodeId, target.id, context)}
                </h3>
                <p className="text-white/60 text-sm">
                  {target.metadata.description}
                </p>
                {target.metadata.zipCoverage && (
                  <p className="text-white/40 text-xs mt-1">
                    ZIPs: {target.metadata.zipCoverage.slice(0, 3).join(', ')}
                    {target.metadata.zipCoverage.length > 3 && '...'}
                  </p>
                )}
                {target.metadata.cities && (
                  <p className="text-white/40 text-xs mt-1">
                    Cities: {target.metadata.cities.slice(0, 3).join(', ')}
                    {target.metadata.cities.length > 3 && '...'}
                  </p>
                )}
              </div>
            </InternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}

interface BreadcrumbProps {
  currentNodeId: string;
  className?: string;
}

// Breadcrumb navigation showing hierarchical path
export function LinkingBreadcrumb({ currentNodeId, className = '' }: BreadcrumbProps) {
  const currentNode = LINKING_ARCHITECTURE[currentNodeId];
  if (!currentNode || currentNode.layer === 0) return null;

  const path: string[] = [];
  let current = currentNode;

  // Build path from current node up to homepage
  while (current && current.parent) {
    path.unshift(current.parent);
    const parent = LINKING_ARCHITECTURE[current.parent];
    current = parent;
  }

  // Add homepage at the beginning
  path.unshift('homepage');

  return (
    <nav className={`py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm text-white/60">
          {path.map((nodeId, index) => {
            const node = LINKING_ARCHITECTURE[nodeId];
            if (!node) return null;
            
            const isLast = index === path.length - 1;
            
            return (
              <li key={nodeId} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 mx-2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {isLast ? (
                  <span className="text-white font-medium">{node.name}</span>
                ) : (
                  <InternalLink
                    from={currentNodeId}
                    to={nodeId}
                    context="upward"
                    className="hover:text-[#FF8A3D] transition-colors"
                  >
                    {node.name}
                  </InternalLink>
                )}
              </li>
            );
          })}
          <li className="flex items-center">
            <svg className="w-4 h-4 mx-2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{currentNode.name}</span>
          </li>
        </ol>
      </div>
    </nav>
  );
}

interface ContextualLinkingProps {
  currentNodeId: string;
  className?: string;
}

// Full contextual linking system for a page
export function ContextualLinking({ currentNodeId, className = '' }: ContextualLinkingProps) {
  const currentNode = LINKING_ARCHITECTURE[currentNodeId];
  if (!currentNode) return null;

  const relationships = getLinkingRelationships(currentNodeId);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Breadcrumb Navigation */}
      {currentNode.layer > 0 && (
        <LinkingBreadcrumb currentNodeId={currentNodeId} />
      )}

      {/* Upward Links (to parent) */}
      {relationships.upward.length > 0 && currentNode.layer > 0 && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="Return to Parent Area"
          context="upward"
          maxLinks={1}
          gridCols={1}
        />
      )}

      {/* Downward Links (to children/clusters) */}
      {relationships.downward.length > 0 && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="Service Areas"
          context="downward"
          maxLinks={6}
          gridCols={3}
        />
      )}

      {/* Sideways Links (to siblings) */}
      {relationships.sideways.length > 0 && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="Nearby Service Areas"
          context="sideways"
          maxLinks={6}
          gridCols={3}
        />
      )}

      {/* Conversion Links */}
      {relationships.conversion.length > 0 && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="Get Started"
          context="conversion"
          maxLinks={1}
          gridCols={1}
        />
      )}
    </div>
  );
}

// Homepage specific linking component (Layer 0)
export function HomepageLinking({ className = '' }: { className?: string }) {
  const homepage = LINKING_ARCHITECTURE.homepage;
  const cityAnchors = homepage.children?.map(id => LINKING_ARCHITECTURE[id]).filter(Boolean) || [];

  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-white">Serving </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#FF6B35]">Greater Phoenix</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cityAnchors.map((city) => (
            <InternalLink
              key={city.id}
              from="homepage"
              to={city.id}
              context="downward"
              className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:border-[#FF8A3D] transition-all block"
            >
              <h3 className="text-xl font-bold text-white group-hover:text-[#FF8A3D] transition-colors mb-2">
                {selectAnchorText('homepage', city.id, 'downward')}
              </h3>
              <p className="text-white/60 text-sm">
                {city.metadata.description}
              </p>
            </InternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}

// City anchor specific linking component (Layer 1)
export function CityAnchorLinking({ currentNodeId, className = '' }: { currentNodeId: string; className?: string }) {
  const relationships = getLinkingRelationships(currentNodeId);
  
  return (
    <div className={`space-y-16 ${className}`}>
      {/* Link back to homepage */}
      <div className="text-center">
        <InternalLink
          from={currentNodeId}
          to="homepage"
          context="upward"
          className="inline-flex items-center text-white/60 hover:text-[#FF8A3D] transition-colors text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Vulpine Homes
        </InternalLink>
      </div>

      {/* Cluster/Service Areas */}
      {relationships.downward.length > 0 && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="Service Areas & Communities"
          context="downward"
          maxLinks={6}
          gridCols={3}
        />
      )}

      {/* Nearby Cities */}
      {relationships.sideways.length > 0 && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="Nearby Cities"
          context="sideways"
          maxLinks={6}
          gridCols={3}
        />
      )}
    </div>
  );
}

// Cluster page specific linking component (Layer 2)
export function ClusterLinking({ currentNodeId, className = '' }: { currentNodeId: string; className?: string }) {
  const currentNode = LINKING_ARCHITECTURE[currentNodeId];
  if (!currentNode) return null;

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Link back to parent city */}
      {currentNode.parent && (
        <div className="text-center">
          <InternalLink
            from={currentNodeId}
            to={currentNode.parent}
            context="upward"
            className="inline-flex items-center text-white/60 hover:text-[#FF8A3D] transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {LINKING_ARCHITECTURE[currentNode.parent]?.name}
          </InternalLink>
        </div>
      )}

      {/* Adjacent Clusters */}
      <LinkingSection
        currentNodeId={currentNodeId}
        title="Nearby Service Areas"
        context="sideways"
        maxLinks={4}
        gridCols={2}
      />

      {/* City-level Services */}
      {currentNode.parent && (
        <LinkingSection
          currentNodeId={currentNodeId}
          title="City-Level Services"
          context="upward"
          maxLinks={1}
          gridCols={1}
        />
      )}
    </div>
  );
}

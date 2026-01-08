'use client';

/**
 * Projects Page
 * 
 * TODO: Full implementation in Phase 2
 * For now, shows a placeholder.
 */

import { TopBar } from '@/components/app-shell';

export default function ProjectsPage() {
    return (
        <div className="projects-page">
            <TopBar title="Projects" />

            <div className="projects-content">
                <div className="placeholder">
                    <p>Projects</p>
                    <span>Coming in Phase 2</span>
                </div>
            </div>

            <style jsx>{`
        .projects-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .projects-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder {
          text-align: center;
          color: var(--color-text-secondary);
        }

        .placeholder p {
          font-size: 17px;
          font-weight: 500;
          margin: 0 0 var(--space-2);
        }

        .placeholder span {
          font-size: 13px;
          color: var(--color-text-tertiary);
        }
      `}</style>
        </div>
    );
}

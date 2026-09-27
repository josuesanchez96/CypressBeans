import React from 'react';
import { Coffee, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onResetDb: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetDb, isResetting }) => {
  return (
    <header data-cy="app-header">
      <div className="brand">
        <Coffee className="brand-icon" size={32} />
        <div>
          <h1 className="brand-title">CypressBeans</h1>
          <span className="brand-tagline">Cafetería de Especialidad & E2E Testing Demo</span>
        </div>
      </div>
      <div className="header-actions">
        <button
          className="btn-reset-db"
          onClick={onResetDb}
          disabled={isResetting}
          data-cy="reset-db-btn"
          title="Reiniciar stock y estado de la base de datos"
        >
          <RotateCcw size={16} className={isResetting ? 'spin' : ''} />
          <span>{isResetting ? 'Reiniciando...' : 'Reset DB (Seed)'}</span>
        </button>
      </div>
    </header>
  );
};

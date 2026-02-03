export type RoadmapStatus = 
  | 'proposed' 
  | 'adr_validated' 
  | 'bdd_pending' 
  | 'bdd_complete' 
  | 'implementing' 
  | 'nfr_validating' 
  | 'nfr_blocked' 
  | 'complete';

export type ViewMode = 'kanban' | 'timeline' | 'dependencies';

export interface NfrResult {
  status: 'pass' | 'fail' | 'pending';
  evidence?: string;
  timestamp?: string;
  validated_by?: string;
  metrics?: Record<string, string | number>;
}

export interface Governance {
  adrs: {
    validated: boolean;
    validated_by?: string;
    validated_at?: string;
    compliance_check?: Array<{
      adr: string;
      compliant: boolean;
      notes?: string;
    }>;
  };
  bdd: {
    id?: string;
    status: 'draft' | 'approved';
    approved_by?: Array<{agent: string; timestamp: string}>;
    test_results?: {
      total: number;
      passed: number;
      failed: number;
      coverage?: string;
    };
  };
  nfrs: {
    applicable: string[];
    status: 'pending' | 'validating' | 'pass' | 'fail';
    results?: Record<string, NfrResult>;
  };
}

export interface RoadmapItem {
  id: string;
  title: string;
  status: RoadmapStatus;
  phase?: number;
  created?: string;
  started?: string;
  completed?: string;
  governance: Governance;
  blocks?: string[];
  depends_on?: string[];
  blocked_by?: string[];
  filePath: string;
}

export interface FilterState {
  search: string;
  status: RoadmapStatus | 'all';
  phase: string;
  governanceFilter: 'all' | 'adr_pending' | 'bdd_pending' | 'nfr_pending';
}

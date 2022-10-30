export interface ShareInfo {
  id?: number;
  name: string;
  email: string;
  status?: string;
  responseId?: number;
  subject?: string;
  message?: string;
  message2?: string;
  answerBtnText?: string;
  answerBtnColor?: string;
  answerBtnTextColor?: string;
}

export interface ShareResponse {
  shares: ShareInfo[];
  totalSize: number;
}

export interface SharedEmailStatistics {
  totalSize: number;
  pending: number;
  failure: number;
  sent: number;
  submitted: number;
  expired: number;
  opened: number;
  clicked: number;
}

export interface SharePercentageStatistic {
  name: string;
  value: number;
  extra: {
    percent: number;
  };
}

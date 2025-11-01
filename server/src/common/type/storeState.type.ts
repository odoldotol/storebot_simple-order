import { BusinessId } from './id';

export type StoreState = {
  business_id: BusinessId;
  state_code: StoreStateCode;
  scheduled_open_at: StoreScheduleTime | null;
  scheduled_break_at: StoreScheduleTime | null;
  scheduled_resume_at: StoreScheduleTime | null;
  scheduled_close_at: StoreScheduleTime | null;
};

/**
 * Orderable 관점에서 0 은 ORDERABLE 이외 음수는 ENDED, 양수는 PAUSED \
 * Business 관점에서 음수는 INACTIVE, 그외는 ACTIVE
 */
export const enum StoreStateCode {
  CLOSED = -2,
  CLOSING,
  OPEN,
  PREPARING,
  BREAK,
}

type StoreScheduleTime = MinutesOfDay;

/**
 * 하루(24시간)을 분단위로 표현 \
 * 0(00:00), 1439(23:59) \
 * 익일 표현 - 1500(25:00) \
 */
type MinutesOfDay = number;

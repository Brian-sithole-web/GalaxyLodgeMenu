type RobotCheckProps = {
  robotConfirmed: boolean;
  onRobotConfirmedChange: (robotConfirmed: boolean) => void;
};

/**
 * Form control in src/components/auth.
 * Visual stand-in for the checkbox captcha on the auth card.
 * It does not call Google. The parent requires the box before submit.
 */
export function RobotCheck({ robotConfirmed, onRobotConfirmedChange }: RobotCheckProps) {
  return (
    <div className="robot-check">
      <label className="robot-check-label">
        <input
          type="checkbox"
          checked={robotConfirmed}
          onChange={(changeEvent) => onRobotConfirmedChange(changeEvent.target.checked)}
        />
        <span>I&apos;m not a robot</span>
      </label>
      <div className="robot-check-badge" aria-hidden="true">
        <svg viewBox="0 0 36 36">
          <path
            fill="#1c7cd6"
            d="M18 6a12 12 0 0 1 10.2 5.7l-3.2 1.8A8 8 0 0 0 10.4 18H6.2A12 12 0 0 1 18 6z"
          />
          <path
            fill="#1c7cd6"
            d="M28.2 14.2 30.6 8l2.2 6.6-4.6-.4zM7.8 21.8A12 12 0 0 0 18 30a12 12 0 0 0 10.2-5.7l-3.2-1.8A8 8 0 0 1 10.4 18H6.2l1.6 3.8z"
          />
          <path fill="#1c7cd6" d="M5.4 22.2 3 28.4 7.6 28l-2.2-5.8z" />
        </svg>
        <span>reCAPTCHA</span>
        <small>Privacy - Terms</small>
      </div>
    </div>
  );
}

const Shared = {
  APP_NAME: "basecase",
  NAVBAR_SIGN_IN_BUTTON_TEXT: "Sign in",
  NAVBAR_SIGN_UP_BUTTON_TEXT: "Sign up",
  FOOTER_TEXT: "© 2026 basecase. All rights reserved",
  PROTECTED_NAVBAR_LOGOUT_BUTTON_TEXT: "Log out",
};

const SignInRoute = {
  SIGN_IN_ROUTE_HEADING: "Welcome back",
  SIGN_IN_ROUTE_SUBHEADING: "Sign in to pick up your prep where you left off.",
  SIGN_IN_ROUTE_BUTTON_TEXT: "Sign in",
};

const LoginModal = {
  LOGIN_MODAL_STANDARD_HEADING: "Sign in to your account",
  LOGIN_MODAL_RETRY_HEADING: "Uh oh. You were logged out, please login again.",
  LOGIN_MODAL_SIGN_IN_BUTTON_TEXT: "Sign in",
  LOGIN_MODAL_USERNAME_FIELD_LABEL: "Username",
  LOGIN_MODAL_USERNAME_FIELD_PLACEHOLDER: "Username",
  LOGIN_MODAL_USERNAME_FIELD_EMPTY_USERNAME_TEXT: "Please enter a username.",
  LOGIN_MODAL_PASSWORD_FIELD_LABEL: "Password",
  LOGIN_MODAL_PASSWORD_FIELD_PLACEHOLDER: "Password",
  LOGIN_MODAL_PASSWORD_FIELD_EMPTY_PASSWORD_TEXT: "Please enter a password.",
  LOGIN_MODAL_SUCCESS_TEXT: "You have been successfully logged in.",
};

const AttemptConfirmation = {
  ATTEMPT_CONFIRMATION_HEADER: "Attempt {problemName}?",
  ATTEMPT_CONFIRMATION_BODY:
    "Are you sure you want to attempt this problem? You will be given {minutes} minutes to complete it, after which your attempt will be a failure and given a score of 0.",
  ATTEMPT_CONFIRMATION_CANCEL_BUTTON: "Cancel",
  ATTEMPT_CONFIRMATION_CONFIRM_BUTTON: "Attempt",
};

const AttemptModal = {
  ATTEMPT_MODAL_HEADER: "Attempting",
  ATTEMPT_MODAL_COMPLETE_BUTTON: "Complete Problem",
  ATTEMPT_MODAL_CONTINUE_BUTTON: "Continue",
  ATTEMPT_MODAL_FORFEIT_BUTTON: "Forfeit",
  ATTEMPT_MODAL_TIME_UP: "Time's up!",
  ATTEMPT_MODAL_TIME_REMAINING: "remaining",
};

const Problems = {
  PROBLEMS_TABLE_PROBLEM_HEADER: "Problem",
  PROBLEMS_TABLE_DIFFICULTY_HEADER: "Difficulty",
  PROBLEMS_TABLE_CONFIDENCE_HEADER: "Confidence",
  PROBLEMS_TABLE_LAST_ATTEMPTED_HEADER: "Last Attempted",
  PROBLEMS_TABLE_ACTION_HEADER: "Action",
  PROBLEMS_TABLE_ACTION_BUTTON_ATTEMPT: "Attempt",
  PROBLEMS_TABLE_ACTION_BUTTON_RESUME: "Resume",
  PROBLEMS_TABLE_DIFFICULTY_EASY: "Easy",
  PROBLEMS_TABLE_DIFFICULTY_MEDIUM: "Medium",
  PROBLEMS_TABLE_DIFFICULTY_HARD: "Hard",
  PROBLEMS_CONTAINER_COMPLETED_COUNT: "(0 / {total})",
};

const Patterns = {
  PATTERN_LABEL_ARRAYS_HASHING: "Arrays and Hashing",
  PATTERN_LABEL_TWO_POINTERS: "Two Pointers",
  PATTERN_LABEL_SLIDING_WINDOW: "Sliding Window",
  PATTERN_LABEL_STACK: "Stack",
  PATTERN_LABEL_BINARY_SEARCH: "Binary Search",
  PATTERN_LABEL_LINKED_LIST: "Linked List",
  PATTERN_LABEL_TREES: "Trees",
  PATTERN_LABEL_HEAP_PQ: "Heap / Priority Queue",
  PATTERN_LABEL_BACKTRACKING: "Backtracking",
  PATTERN_LABEL_TRIES: "Tries",
  PATTERN_LABEL_GRAPHS: "Graphs",
  PATTERN_LABEL_ADVANCED_GRAPHS: "Advanced Graphs",
  PATTERN_LABEL_DYNAMIC_1D: "1-D Dynamic Programming",
  PATTERN_LABEL_DYNAMIC_2D: "2-D Dynamic Programming",
  PATTERN_LABEL_GREEDY: "Greedy",
  PATTERN_LABEL_INTERVALS: "Intervals",
  PATTERN_LABEL_MATH_GEOMETRY: "Math and Geometry",
  PATTERN_LABEL_BIT_MANIPULATION: "Bit Manipulation",
};

export const messages = {
  ...Shared,
  ...SignInRoute,
  ...LoginModal,
  ...AttemptConfirmation,
  ...AttemptModal,
  ...Problems,
  ...Patterns,
};

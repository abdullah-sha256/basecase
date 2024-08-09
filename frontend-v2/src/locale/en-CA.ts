const Shared = {
  APP_NAME: "Code Now",
  NAVBAR_SIGN_IN_BUTTON_TEXT: "Sign in",
  NAVBAR_SIGN_UP_BUTTON_TEXT: "Sign up",
  FOOTER_TEXT: "© 2024 Code Now. All rights reserved",
  PROTECTED_NAVBAR_LOGOUT_BUTTON_TEXT: "Log out",
};

const LandingRoute = {
  LANDING_ROUTE_HERO_SECTION_PRIMARY_HEADER: "Ready to Code Now?",
  LANDING_ROUTE_HERO_SECTION_SECONDARY_HEADER:
    "Everything you need to excel in your next software interview is now made available through Code Next.",
  LANDING_ROUTE_HERO_SECTION_PRIMARY_BUTTON_TEXT: "I am ready",
  LANDING_ROUTE_HERO_SECTION_SECONDARY_BUTTON_TEXT: "Learn more",
  LANDING_ROUTE_FEATURE_SECTION_PRIMARY_HEADER: "We make it easy.",
  LANDING_ROUTE_FEATURE_SECTION_SECONDARY_HEADER:
    "Our features are backed by science and designed to make your leetcode grind much more effective. Below are some of the ways we make your preparation better.",
  LANDING_ROUTE_FEATURE_SECTION_FIRST_CARD_HEADER: "Tailored plan",
  LANDING_ROUTE_FEATURE_SECTION_FIRST_CARD_TEXT:
    "Lorem ipsum dolor sit amet catetur, adipisicing elit.",
  LANDING_ROUTE_FEATURE_SECTION_SECOND_CARD_HEADER: "Distributed practice",
  LANDING_ROUTE_FEATURE_SECTION_SECOND_CARD_TEXT:
    "Lorem ipsum dolor sit amet catetur, adipisicing elit.",
  LANDING_ROUTE_FEATURE_SECTION_THIRD_CARD_HEADER: "Progress Tracking",
  LANDING_ROUTE_FEATURE_SECTION_THIRD_CARD_TEXT:
    "Lorem ipsum dolor sit amet catetur, adipisicing elit.",
  LANDING_ROUTE_FEATURE_CARD_LEARN_MORE_TEXT: "Learn more",
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

export const messages = {
  ...Shared,
  ...LandingRoute,
  ...LoginModal,
};

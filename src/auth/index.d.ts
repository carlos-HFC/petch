type TLogin = {
  email: string;
  password: string;
};

type TGoogleLogin = {
  email: string;
  googleId: string;
  name?: string;
  avatar?: string;
};

type TResetPassword = TLogin & {
  token: string;
  confirmPassword: string;
};
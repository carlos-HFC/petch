type TLogin = {
  email: string;
  password: string;
};

type TGoogleLogin = {
  email: string;
  name: string;
  googleId: string;
  avatar?: string;
};

type TResetPassword = TLogin & {
  token: string;
  confirmPassword: string;
};
type TCreateGift = {
  name: string;
  description: string;
  partnerId?: number;
  color?: string;
  size?: string;
  weight?: string;
  taste?: string;
};

type TUpdateGift = Partial<TCreateGift>;

type TFilterGift = {
  inactives?: boolean;
  name?: string;
};
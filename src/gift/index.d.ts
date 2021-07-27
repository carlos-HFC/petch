type TCreateGift = {
  partnerId: number;
  name: string;
  description: string;
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
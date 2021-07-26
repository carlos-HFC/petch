type TCreateGift = {
  partnerId: number
  name: string;
  description: string;
  coverage: string;
  color?: string;
  size?: string;
  weight?: string;
  taste?: string;
}

type TUpdateGift = Partial<TCreateGift>
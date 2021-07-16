type TCreateGift = {
  name: string;
  color?: string;
  size?: string;
  weight?: string;
  taste?: string;
}

type TUpdateGift = Partial<TCreateGift>
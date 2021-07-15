type TCreateGift = {
  name: string;
  color: string;
  size?: string;
}

type TUpdateGift = Partial<TCreateGift>
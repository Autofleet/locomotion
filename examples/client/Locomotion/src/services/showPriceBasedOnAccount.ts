import { GetBusinessAccountById } from '../context/payments/interface';

type LoadShowPriceFunction = (showPriceToMembers?: boolean) => void;

export default (
  loadShowPrice: LoadShowPriceFunction,
  getBusinessAccountById: GetBusinessAccountById,
  businessAccountId: string | null | undefined,
) => {
  if (businessAccountId) {
    const { showPriceToMembers } = getBusinessAccountById(businessAccountId) ?? {};
    loadShowPrice(showPriceToMembers ?? false);
  } else {
    loadShowPrice();
  }
};



type GetBusinessAccountByIdFunction = (id: string) => any | null;

type LoadShowPriceFunction = (showPriceToMembers?: boolean) => void;

export default (
  loadShowPrice: LoadShowPriceFunction,
  getBusinessAccountById: GetBusinessAccountByIdFunction,
  businessAccountId: string | null | undefined,
) => {
  if (businessAccountId) {
    const { showPriceToMembers } = getBusinessAccountById(businessAccountId);
    loadShowPrice(showPriceToMembers ?? false);
  } else {
    loadShowPrice();
  }
};

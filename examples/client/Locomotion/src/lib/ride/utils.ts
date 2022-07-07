import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';

export const formatSps = function (stopPoints: any) {
  const orderDesc: any = {};

  const getOrdinalDescForSp = (sp: any) => {
    const val = orderDesc[sp.type] || 0;
    orderDesc[sp.type] = (
      val + 1
    );
    return val;
  };

  return stopPoints
    .sort((sp1: any, sp2: any) => sp1.orderInParent - sp2.orderInParent)
    .map((sp: any) => ({
      ...sp,
      ordinalDesc: getOrdinalDescForSp(sp),
    }));
};

export const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};


export const isCashPaymentMethod = (paymentMethod: any) => paymentMethod.id === cashPaymentMethod.id;

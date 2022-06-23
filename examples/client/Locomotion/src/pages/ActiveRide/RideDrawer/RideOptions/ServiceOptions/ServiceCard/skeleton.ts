/* eslint-disable import/prefer-default-export */
export const serviceCardSkeleton = {
  flexDirection: 'row',
  width: '100%',
  padding: 20,
  alignItems: 'center',
  children: [
    {
      width: 40,
      height: 40,
    },
    {
      flexDirection: 'column',
      flexGrow: 1,
      paddingLeft: 20,
      children: [
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          children: [
            {
              width: '50%',
              height: 10,
            },
            {
              width: '20%',
              height: 10,
            },
          ],
        },
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '40%',
          marginBottom: 10,
          children: [
            {
              width: '30%',
              height: 10,
            },
            {
              width: '60%',
              height: 10,
            },
          ],
        },
        {
          width: '45%',
          height: 10,
        },
      ],
    }],
};


const needOnBoarding = userProfile => !userProfile.firstName || !userProfile.lastName;

export default needOnBoarding;

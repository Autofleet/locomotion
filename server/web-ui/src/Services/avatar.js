import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-initials-sprites';

const avatars = new Avatars(sprites, { radius: 50 });

export const generateAvatarById = id =>
  avatars.create(id);

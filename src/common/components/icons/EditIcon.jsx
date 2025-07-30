/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Pencil } from 'lucide-react';

const EditIcon = ({
  size = 15,
  color = 'white',
  fill = '#005696',
  strokeWidth = 1,
}) => {
  return (
    <Pencil size={size} color={color} fill={fill} strokeWidth={strokeWidth} />
  );
};

export default EditIcon;

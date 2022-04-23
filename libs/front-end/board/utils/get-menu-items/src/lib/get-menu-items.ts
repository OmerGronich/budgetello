import { MenuItem } from 'primeng/api';

type Cb = (event: any) => void;

export const getMenuItems = ({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: Cb;
  onDeleteClick: Cb;
}): MenuItem[] => [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: onEditClick,
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: onDeleteClick,
  },
];

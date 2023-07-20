interface SubSidebarItemProps {
  label: string;
  href: string;
  active: boolean;
}

const SubSidebarItem: React.FC<SubSidebarItemProps> = ({
  label,
  href,
  active,
}) => {
  return <div>SubSidebarItem</div>;
};

export default SubSidebarItem;

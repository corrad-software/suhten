import type { MenuGroupDef, MenuItemDef, MenuNode } from "@/config/admin-menu";
import { staffMenuFor, type StaffMenuItemDef, type StaffMenuNode } from "@/st/config/staff-menu";

const ADMIN_ST_PREFIX = "/admin/st";

function remapPath(path: string): string {
  return path.replace(/^\/st/, ADMIN_ST_PREFIX);
}

function mapNode(node: StaffMenuNode): MenuNode {
  return {
    id: `st-${node.id}`,
    label: node.label,
    to: remapPath(node.to),
    children: node.children?.map(mapNode),
  };
}

function mapItem(item: StaffMenuItemDef): MenuItemDef {
  return {
    id: `st-${item.id}`,
    label: item.label,
    to: remapPath(item.to),
    icon: item.icon,
    children: item.children?.map(mapNode),
  };
}

/** SRS Kakitangan menu adapted for the /admin sidebar (CMS login). */
export function stAdminMenuGroups(): MenuGroupDef[] {
  return staffMenuFor("admin").map((group) => ({
    id: `st-${group.id}`,
    label: group.label || "Sistem Digital ST",
    items: group.items.map(mapItem),
  }));
}

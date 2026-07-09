import type { MenuGroupDef, MenuNode } from "@/config/admin-menu";
import type { DisplayLanguage } from "@/types";

import { menuLabel } from "./menu-labels";

function translateNode(node: MenuNode, locale: DisplayLanguage): MenuNode {
  return {
    ...node,
    label: menuLabel(node.id, node.label, locale),
    children: node.children?.map((child) => translateNode(child, locale)),
  };
}

export function translateMenuGroups(groups: MenuGroupDef[], locale: DisplayLanguage): MenuGroupDef[] {
  return groups.map((group) => ({
    ...group,
    label: group.label ? menuLabel(group.id, group.label, locale) : group.label,
    items: group.items.map((item) => ({
      ...item,
      label: menuLabel(item.id, item.label, locale),
      children: item.children?.map((child) => translateNode(child, locale)),
    })),
  }));
}

import { getLockStatus } from '@/lib/course-schedule';
import { CheckCircle2, LockIcon } from 'lucide-react';

import type { Root, Node, Item } from 'fumadocs-core/page-tree';

/**
 * Transform page tree: append status icon to the RIGHT of sidebar item names.
 * - locked lesson  -> lock icon
 * - completed item -> green check icon
 */
export function annotateTreeWithStatus(tree: Root, completedSlugs: Set<string> = new Set()): Root {
  return {
    ...tree,
    children: tree.children.map((node) => annotateNode(node, completedSlugs)),
  };
}

function annotateNode(node: Node, completedSlugs: Set<string>): Node {
  if (node.type === 'page') {
    return annotateItem(node, completedSlugs);
  }
  if (node.type === 'folder') {
    return {
      ...node,
      children: node.children.map((child) => annotateNode(child, completedSlugs)),
      index: node.index ? annotateItem(node.index, completedSlugs) : undefined,
    };
  }
  return node;
}

function annotateItem(item: Item, completedSlugs: Set<string>): Item {
  const slug = item.url.replace(/^\/docs\/?/, '').replace(/\/$/, '');
  const isCompleted = completedSlugs.has(slug);
  const lockStatus = getLockStatus(slug);

  if (!lockStatus.locked && !isCompleted) return item;

  return {
    ...item,
    name: (
      <span
        className={`flex items-center gap-1.5 w-full ${lockStatus.locked ? 'opacity-50' : ''}`}
      >
        <span className="flex-1 truncate">{item.name}</span>
        {lockStatus.locked ? (
          <span title="Nội dung chưa mở" aria-label="Nội dung chưa mở">
            <LockIcon className="w-3 h-3 shrink-0 text-fd-muted-foreground/50" />
          </span>
        ) : isCompleted ? (
          <span title="Đã học xong" aria-label="Đã học xong">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-600 dark:text-green-400" />
          </span>
        ) : null}
      </span>
    ),
  };
}

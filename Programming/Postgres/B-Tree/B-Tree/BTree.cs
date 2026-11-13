using System;
using System.Collections.Generic;
using System.Text;

namespace B_Tree
{
    public class BTree
    {
        public int Order { get; }
        public BTreeNode Root { get; set; }
        public BTree()
        {
            Root = new BTreeNode();
        }

        public BTree(int order)
        {
            if (order < 3)
            {
                throw new ArgumentException("Order must be at least 3.");
            }

            Order = order;
            Root = new BTreeNode();
        }
    }

    public class BTreeNode
    {
        public List<int> Keys { get; set; }
        public List<BTreeNode> Children { get; set; }
        public bool IsLeaf { get; set; }
        public BTreeNode()
        {
            Keys = new List<int>();
            Children = new List<BTreeNode>();
            IsLeaf = true;
        }

    }
}

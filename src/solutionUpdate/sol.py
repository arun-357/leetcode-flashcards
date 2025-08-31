# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        Flattens the binary tree to a linked list in-place following preorder traversal.
        """
        curr = root

        # Traverse through the tree using the right pointer
        while curr:
            if curr.left:
                # Find the rightmost node of the left subtree
                p = curr.left
                while p.right:
                    p = p.right
                
                # Attach the original right subtree to this rightmost node
                p.right = curr.right

                # Move the left subtree to the right
                curr.right = curr.left
                curr.left = None   # Clear the left pointer
            
            # Move to the next right node (linked list style)
            curr = curr.right

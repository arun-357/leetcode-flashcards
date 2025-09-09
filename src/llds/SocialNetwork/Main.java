//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.

import java.util.List;

public class Main {
    public static void main(String[] args) {
        SocialNetworkFacade facade = new SocialNetworkFacade();

        // Create Users
        User alice = facade.createUser("Alice");
        User bob = facade.createUser("Bob");
        User charlie = facade.createUser("Charlie");

        // Add friends
        facade.addFriend(alice, bob.getUserId());      // Alice ↔ Bob
        facade.addFriend(alice, charlie.getUserId());  // Alice ↔ Charlie

        // Alice creates a post
        Post post = facade.createPost(alice.getUserId(), "Hello World!");

        // Bob creates a comment
        Comment comment = new Comment(post.getPostId(), bob.getUserId(), "Nice post!");
        post.addComment(comment);

        // Charlie replies to Bob’s comment
        Comment reply = new Comment(comment.getCommentId(), charlie.getUserId(), "I agree!");
        comment.addComment(reply);

        // ✅ Bob should see Alice’s post in feed
        System.out.println("Bob's Feed:");
        List<Post> bobFeed = facade.getFeed(bob.getUserId());
        for (Post p : bobFeed) {
            System.out.println("- " + p.getContent());
        }

        // ✅ Charlie should see Alice’s post in feed
        System.out.println("Charlie's Feed:");
        List<Post> charlieFeed = facade.getFeed(charlie.getUserId());
        for (Post p : charlieFeed) {
            System.out.println("- " + p.getContent());
        }

        // ✅ Comment association check
        System.out.println("Comment c1 postId: " + comment.getPostId()); // should match post id
        System.out.println("Reply c2 postId: " + reply.getPostId());     // should match post id
    }
}
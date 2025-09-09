import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Comment implements Commentable {
    private String postId;
    private String userId;
    private String commentId;
    private String text;
    private List<Commentable> replies = new ArrayList<>();

    public Comment(String postId, String userId, String text) {
        this.commentId = UUID.randomUUID().toString();
        this.userId = userId;
        this.postId = postId;
        this.text = text;
    }

    public String getCommentId() {
        return commentId;
    }

    public String getPostId() {
        return postId;
    }

    public String getText() {
        return text;
    }

    @Override
    public void addComment(Commentable comment) {
        replies.add(comment);
    }

    @Override
    public void show(int depth) {
        System.out.println(" ".repeat(depth) + "Comment: " + text);
        replies.forEach(c -> c.show(depth + 2));
    }
}

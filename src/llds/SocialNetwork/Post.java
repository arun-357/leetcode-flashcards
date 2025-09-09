import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Post implements Commentable {
    private String postId;
    private String userId;
    private String content;
    private List<Commentable> comments = new ArrayList<>();

    public Post(String userId, String content) {
        this.postId = UUID.randomUUID().toString();
        this.userId = userId;
        this.content = content;
    }

    public String getPostId() {
        return postId;
    }

    public String getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    @Override
    public void addComment(Commentable comment) {
        comments.add(comment);
    }

    @Override
    public void show(int depth) {
        System.out.println(" ".repeat(depth) + "Post: " + content);
        comments.forEach(c -> c.show(depth + 2));
    }
}

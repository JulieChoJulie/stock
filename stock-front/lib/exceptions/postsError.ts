export class PostsError extends Error {
  constructor(
    message = "Oops! We're having trouble loading the latest posts right now. This could be due to a temporary glitch on our server. Please try again later. In the meantime, you can explore other parts of the app or check back in a little while. We apologize for any inconvenience.",
  ) {
    super(message)
    this.name = "PostsError"
  }
}

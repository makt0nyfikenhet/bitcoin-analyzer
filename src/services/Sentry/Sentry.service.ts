class SentryService {
  static sendError(err: Error) {
    console.log(err, "Error sent");
  }
}

export default SentryService;

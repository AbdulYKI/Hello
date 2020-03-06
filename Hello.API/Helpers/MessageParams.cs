namespace Hello.API.Helpers
{
    public enum Container { INBOX = 1, OUTBOX = 2, UNREAD = 3 }
    public class MessageParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
        public int UserId { get; set; }
        public Container MessageContainer { get; set; } = Container.UNREAD;

    }
}
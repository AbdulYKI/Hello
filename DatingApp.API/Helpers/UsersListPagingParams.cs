namespace DatingApp.API.Helpers
{
    public enum OrderBy { CREATED = 1, ACTIVE = 2 }
    public class UsersListPagingParams
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
        public string Gender { get; set; }
        public int MaxAge { get; set; } = 99;
        public int MinAge { get; set; } = 18;
        public OrderBy OrderBy { get; set; } = OrderBy.CREATED;
    }
}
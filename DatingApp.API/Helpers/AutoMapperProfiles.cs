using System.Linq;
using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDTO>()
            .ForMember(dest => dest.PhotoUrl,
             opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age,
            opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForDetailedDTO>()
             .ForMember(dest => dest.PhotoUrl,
             opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
             .ForMember(dest => dest.Age,
            opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge())); ;

            CreateMap<Photo, PhotoForDetailedDTO>();

            CreateMap<UserForEditDTO, User>();

            CreateMap<PhotoForAddingDTO, Photo>();
            CreateMap<Photo, PhotoToReturnDTO>();
            CreateMap<User, UserToReturnDTO>()
            .ForMember(dest => dest.PhotoUrl,
             opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age,
            opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge()));
        }
    }
}
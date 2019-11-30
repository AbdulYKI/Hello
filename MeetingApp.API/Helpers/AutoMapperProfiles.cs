using System;
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
            opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge()))
            .ForMember(dest => dest.Created,
            opt => opt.ResolveUsing(src => src.Created.ToLocalTime()))
            .ForMember(dest => dest.LastActive,
            opt => opt.ResolveUsing(src => src.LastActive.ToLocalTime()))
            .ForMember(dest => dest.Country,
             opt => opt.MapFrom(src => src.Country.Name))
             .ForMember(dest => dest.Alpha2Code,
             opt => opt.MapFrom(src => src.Country.Alpha2Code))
            ;

            CreateMap<Photo, PhotoForDetailedDTO>();

            CreateMap<UserForEditDTO, User>();
            CreateMap<Country, CountryDTO>();
            CreateMap<PhotoForAddingDTO, Photo>();
            CreateMap<Photo, PhotoToReturnDTO>();
            CreateMap<Message, MessageForSendingDTO>()
            .ForMember(dest => dest.MessageSent, opt => opt.ResolveUsing(src => src.MessageSent.ToLocalTime()))
            .ReverseMap();

            CreateMap<User, UserToReturnDTO>()
            .ForMember(dest => dest.PhotoUrl,
             opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age,
            opt => opt.ResolveUsing(src => src.DateOfBirth.CalculateAge()));
            CreateMap<UserForRegisterDTO, User>();
            CreateMap<Message, MessageToReturnDTO>()
            .ForMember(dest => dest.MessageSent, opt => opt.ResolveUsing(src => src.MessageSent.ToLocalTime()))
            .ForMember(dest => dest.DateRead, opt => opt.ResolveUsing(src => src.DateRead != null ? src.DateRead.Value.ToLocalTime() :
                                                                                                    src.DateRead))
            .ForMember(dest => dest.SenderPhotoUrl,
            opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url));




        }
    }
}
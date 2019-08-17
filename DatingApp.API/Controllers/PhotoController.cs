using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/user/{userId}/photo")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private readonly IDatingAppRepository _repo;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;
        public PhotoController(IDatingAppRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinarySettings)
        {
            _cloudinarySettings = cloudinarySettings;
            _repo = repo;
            _mapper = mapper;
            var account = new Account(_cloudinarySettings.Value.CloudName,
                                    _cloudinarySettings.Value.ApiKey,
                                    _cloudinarySettings.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);


        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _repo.GetPhoto(id);
            var photoToReturn = _mapper.Map<PhotoToReturnDTO>(photo);
            return Ok(photoToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForAddingDTO photoForAddingDTO)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(userId);
            var file = photoForAddingDTO.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParameters = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().
                        Width(450).
                        Height(450).
                        Crop("fill").
                        Gravity("face").
                        Quality("100")
                    };
                    uploadResult = _cloudinary.Upload(uploadParameters);

                }


            }
            photoForAddingDTO.PublicId = uploadResult.PublicId;
            photoForAddingDTO.Url = uploadResult.Uri.ToString();

            var photo = _mapper.Map<Photo>(photoForAddingDTO);
            if (!userFromRepo.Photos.Any(p => p.IsMain))
                photo.IsMain = true;
            userFromRepo.Photos.Add(photo);
            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoToReturnDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }
            return BadRequest("Uploading image failed");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();


            var userFromRepo = await _repo.GetUser(userId);
            if (!userFromRepo.Photos.Any(p => p.Id == id))
                return Unauthorized();
            var photoFromRepo = await _repo.GetPhoto(id);
            if (photoFromRepo.IsMain)
                return BadRequest("Photo is already the main one.");
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;



            photoFromRepo.IsMain = true;
            if (await _repo.SaveAll())
                return NoContent();
            return BadRequest("Failed to set new main photo!");

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();


            var userFromRepo = await _repo.GetUser(userId);
            if (!userFromRepo.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);
            if (photoFromRepo.IsMain)
                return BadRequest("Cannot delete main photo");

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);
                if (result.Result == "ok")
                    _repo.Delete(photoFromRepo);



            }
            else
                _repo.Delete(photoFromRepo);




            if (await _repo.SaveAll())
                return Ok();
            return BadRequest("failed to delete photo");
        }


    }

}
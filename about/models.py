from django.db import models


class About(models.Model):
    iframe_video = models.URLField(
        max_length=200,)
    iframe_video_image = models.ImageField(
        upload_to='about_images/',
        verbose_name="Iframe Video Image",
    )
    iframe_video_text = models.CharField(
        max_length=200,
        verbose_name="Iframe Video Text",
    )
    our_history_content_one = models.TextField(
        verbose_name="Our History Content",
    )

    our_history_image_one = models.ImageField(
        upload_to='about_images/',
        verbose_name="Our History Image One",
        blank=True,
        null=True,
    )
    our_history_image_two = models.ImageField(
        upload_to='about_images/',
        verbose_name="Our History Image Two",
        blank=True,
        null=True,
    )
    our_history_content_two = models.TextField(
        verbose_name="Our History Content",
    )

    our_history_image_three = models.ImageField(
        upload_to='about_images/',
        verbose_name="Our History Image Three",
        blank=True,
        null=True,
    )
    our_history_image_four = models.ImageField(
        upload_to='about_images/',
        verbose_name="Our History Image Four",
        blank=True,
        null=True,
    )

    our_mission = models.TextField(
        verbose_name="Our Mission",)
    our_vision = models.TextField(
        verbose_name="Our Vision",)
    our_mission_image = models.ImageField(
        upload_to='our_mission/',
        verbose_name="Our Mission Image", blank=True,)
    our_vision_image = models.ImageField(
        upload_to='our_vision/',
        verbose_name="Our Vision Image",        null=True,)
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True,  verbose_name="Updated At")
    value_image = models.ImageField(
        upload_to='about_images/',
        verbose_name="Value Image",
    )
    end_image = models.ImageField(
        upload_to='end_image/', verbose_name='An image at the end of the page', blank=True, null=True)

    policies_description = models.TextField(
        verbose_name="Policies",
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "About"
        verbose_name_plural = "Abouts"


class AboutValuesContent(models.Model):
    about = models.ForeignKey(
        About, related_name='about', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title}"

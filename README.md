# Designer Mohamed Sultan's website

## sections

1 : auth => create update delete get one & get all
2 : work => create update delete get one & get all
3 : lesson => create update delete get one & get all
4 : skill => create update delete get one & get all

### work

He can create, update, delete and access any work and can upload one video to any work and video cover but he can upload as many images as he wants

I have created endpoints for each of the
1 : create
2 : delete
3 : update
4 : get one
5 : get all
6 : change the work's video cover
and if he wantto delete the work's video he should send in the body a video_reaction = "delete" to delete it if if he want to updatethe video he should to send an new video in form data in update endpoint

### lesson

The lesson and work are similar with the addition of failed level to the lesson.

## skill

He can create, update, delete and access any skill but the skill hasn't anyvideo or cover or images just a icon of skill


#!/bin/bash


# Replaces all _lightweight_ Git tags with an _annotated_ tag
# in the current repository

echo "Converting lightweight tags to annotated tags..."

for tag in $(git tag)
do
    echo "Converting tag $tag"

    cmt=$(git log -1 --pretty=%s $tag)
    tagger=$(git log -1 --pretty=%an $tag)
    tagmail=$(git log -1 --pretty=%ae $tag)
    tagdate=$(git log -1 --pretty=%ad $tag)

    git checkout $tag
    git tag -d $tag
    GIT_COMMITTER_EMAIL=$tagmail GIT_COMMITTER_DATE=$tagdate GIT_COMMITTER_NAME=$tagger git tag -a -m "$cmt" $tag

    git push origin :refs/tags/$tag
    git push --tags

done

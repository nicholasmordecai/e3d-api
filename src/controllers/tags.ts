import { Tags, ITag } from './../models/tags';
import { ObjectTags } from './../models/objectTags';
import { uniqueElements } from './../utils/utils';

export async function tagObject(objectID: number, tags: string[]): Promise<void> {
    // get existing tags
    const existingTags: ITag[] = await Tags.findMultipleByTagNames(tags);
    const existingsTagsAsStrings: string[] = existingTags.map((index) => index.tag);
    const dateNow: number = new Date().getTime();

    // create any tags that don't already exist
    type uniqueTag = [string, number]
    const uniqueTags: uniqueTag[] = uniqueElements<string>(tags, existingsTagsAsStrings).map((i) => [i, dateNow]);
    if (uniqueTags.length > 0) {
        await Tags.insertMultipleTags(uniqueTags);
    }

    // now get all tags for the id to be used in the object_tag table
    const allTags: ITag[] = await Tags.findMultipleByTagNames(tags);
    const tagIDs: number[] = allTags.map((v) => v.id);
    const tagIdsToInsert: number[] = [];

    // get existing object_tag ids so we don't add duplicates
    const existingObjectTags = await ObjectTags.getTagsByObjectId(objectID);
    const existingObjectTagIds: number[] = existingObjectTags.map((v) => v.tag_id);

    // find which tags are already duplicated and only push to the toInsert array those that are unique
    for (const tagId of tagIDs) {
        if (!existingObjectTagIds.includes(tagId)) {
            tagIdsToInsert.push(tagId);
        }
    }

    // if there are tags that need to be added to the object, then do so here
    if (tagIdsToInsert.length >= 1) {
        type newObjectTag = [number, number, number];
        const objectTags: newObjectTag[] = [];

        for (const id of tagIdsToInsert) {
            objectTags.push([
                objectID,
                id,
                dateNow,
            ]);
        }

        await ObjectTags.insertMultiple(objectTags);
    }
}

import vine from '@vinejs/vine'

const data = vine.group([
  vine.group.if((value) => 'qcm' === value.type, {
    content: vine.object({
      type: vine.literal('qcm'),
      data: vine.object({
        choices: vine.array(
          vine.object({
            label: vine.string(),
            isCorrect: vine.boolean(),
          })
        ),
      }),
    }),
  }),
  vine.group.if((value) => 'text-hole' === value.type, {
    content: vine.object({
      type: vine.literal('text-hole'),
      data: vine.object({
        text: vine.string(),
        answers: vine.array(vine.string()),
      }),
    }),
  }),
])

export const storeQuestionValidator = vine.compile(vine.object({}).merge(data))

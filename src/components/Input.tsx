import { useForm } from "@mantine/form";
import {
  TextInput,
  ActionIcon,
  Container,
  Text,
  Button,
  Table,
  Flex,
  NumberInput,
  Box,
  Space,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { Trash } from "tabler-icons-react";
import CPM from "../model/CPM";
import { CPMTable } from "../@types";
import { TEST_DATA } from "../utils/constant";

export default function Input() {
  const form = useForm({
    initialValues: {
      activityCount: TEST_DATA.length,
      criticalPath: [] as string[],
      projectDuration: -1,
      activities: TEST_DATA as CPMTable,
    },
  });

  const fields = form.values.activities.map((item, index) => (
    <tr key={item.key}>
      <td>
        <TextInput
          placeholder={`Activity ${index + 1}`}
          withAsterisk
          sx={{ flex: 1 }}
          required
          {...form.getInputProps(`activities.${index}.name`)}
        />
      </td>
      <td>
        <NumberInput
          placeholder={Math.floor(Math.random() * 10).toString()}
          withAsterisk
          sx={{ flex: 1 }}
          required
          {...form.getInputProps(`activities.${index}.duration`)}
        />
      </td>
      <td>
        <TextInput
          placeholder="-"
          withAsterisk
          sx={{ flex: 1 }}
          {...form.getInputProps(`activities.${index}.predessors`)}
        />
      </td>
      <td>
        <Text>
          {
            form.values.activities.find((activity) => activity.key === item.key)
              ?.est
          }
        </Text>
      </td>
      <td>
        {
          form.values.activities.find((activity) => activity.key === item.key)
            ?.eft
        }
      </td>
      <td>
        {
          form.values.activities.find((activity) => activity.key === item.key)
            ?.lst
        }
      </td>
      <td>
        {
          form.values.activities.find((activity) => activity.key === item.key)
            ?.lft
        }
      </td>
      <td>
        {
          form.values.activities.find((activity) => activity.key === item.key)
            ?.slack
        }
      </td>
      <td>
        <ActionIcon
          color="red"
          onClick={() => form.removeListItem("activities", index)}
        >
          <Trash size={16} />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <Container>
      <form
        onSubmit={form.onSubmit((values) => {
          const cpm = new CPM(values.activities);
          const table = cpm.Calculate();
          form.setFieldValue("criticalPath", cpm.critical_path);
          form.setFieldValue("projectDuration", cpm.total_duration);
          form.setFieldValue("activities", table);
        })}
      >
        <Flex align="flex-end" gap="md">
          <NumberInput
            placeholder="5"
            size="md"
            min={1}
            required
            label="Enter total number of activities"
            withAsterisk
            {...form.getInputProps("activityCount")}
          />
          <Button
            size="md"
            onClick={() => {
              // clear form
              form.reset();

              // generate fields

              form.setFieldValue(
                "activities",
                Array.from({ length: form.values.activityCount }, () => ({
                  name: "",
                  duration: 0,
                  key: randomId(),
                  predessors: "",
                  est: 0,
                  eft: 0,
                  lst: 0,
                  lft: 0,
                  slack: 0,
                }))
              );
              form.setFieldValue("activityCount", form.values.activityCount);
            }}
            variant="light"
          >
            Generate Table
          </Button>
          <Button
            size="md"
            onClick={() => {
              form.reset();
            }}
            color="red"
            variant="light"
          >
            Clear Table
          </Button>
          <Button type="submit" size="md" color="orange" variant="light">
            Calculate
          </Button>
          <Button size="md" color="grape" variant="light">
            Generate Graph
          </Button>
        </Flex>
        <Space h="md" />
        {form.values.activities.length > 0 ? (
          <Box>
            <Table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Duration</th>
                  <th>Predessors</th>
                  <th>ES</th>
                  <th>EF</th>
                  <th>LS</th>
                  <th>LF</th>
                  <th>Slack</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{fields}</tbody>
            </Table>
            <Text>
              {form.values.criticalPath.length > 0 && (
                <Text>
                  Critical Path:
                  {form.values.criticalPath.map((activity, idx) => {
                    if (idx === form.values.criticalPath.length - 1)
                      return activity;
                    return activity + "-";
                  })}
                </Text>
              )}
            </Text>
            {form.values.projectDuration !== -1 && (
              <Text>Project Duration: {form.values.projectDuration}</Text>
            )}
          </Box>
        ) : (
          <Text>
            Enter the number of activities and click on Generate Table
          </Text>
        )}
      </form>
    </Container>
  );
}
